import React from 'react';

const Gauge = ({ 
  value = 2.5, 
  min = 0, 
  max = 5, 
  label = '',
  displayType = 'percentage', // 'percentage', 'value', or 'custom'
  customDisplay = null, // Function to format display
  tickInterval = 1, // Interval between ticks
  showTicks = true, // Whether to show tick marks and labels
  colors = ['#22c55e', '#10b981', '#84cc16', '#eab308', '#f59e0b', '#ef4444'],
  size = 300,
  thickness = 40 // Thickness of the gauge arc
}) => {
  // Generate unique ID for this instance
  const uniqueId = React.useId();
  const maskId = `textMask-${uniqueId}`;
  const filterId = `invert-${uniqueId}`;
  
  // Ensure value is within bounds
  const clampedValue = Math.max(min, Math.min(max, value));
  
  // Calculate percentage
  const percentage = ((clampedValue - min) / (max - min)) * 100;
  
  // Calculate angle for the needle (180 degree arc, horizontal orientation)
  const needleAngle = (percentage / 100) * 180;
  
  // SVG dimensions
  const width = size;
  const height = size / 2 + 40;
  const centerX = width / 2;
  const centerY = height - 20;
  const radius = (width / 2) - 30;
  const innerRadius = radius - thickness;
  
  // Calculate tick positions based on actual values
  const ticks = [];
  if (showTicks) {
    // Start from the first tick that's at or above min
    let tickValue = Math.ceil(min / tickInterval) * tickInterval;
    // If the first tick is below min, start from min
    if (tickValue < min) tickValue = min;
    
    while (tickValue <= max) {
      const tickPercentage = ((tickValue - min) / (max - min)) * 100;
      const tickAngle = (tickPercentage / 100) * 180;
      ticks.push({ value: tickValue, angle: tickAngle });
      tickValue += tickInterval;
    }
    
    // Always include min and max if they're not already included
    if (ticks.length === 0 || ticks[0].value !== min) {
      ticks.unshift({ value: min, angle: 0 });
    }
    if (ticks[ticks.length - 1].value !== max) {
      ticks.push({ value: max, angle: 180 });
    }
  }
  
  // Create color segments based on tick positions
  const colorSegments = [];
  if (ticks.length > 1) {
    const segmentCount = Math.min(colors.length, ticks.length - 1);
    for (let i = 0; i < segmentCount; i++) {
      const startPercent = (i / segmentCount) * 100;
      const endPercent = ((i + 1) / segmentCount) * 100;
      const startAngle = (startPercent / 100) * 180;
      const endAngle = (endPercent / 100) * 180;
      colorSegments.push({
        color: colors[i],
        startAngle,
        endAngle
      });
    }
  }
  
  const createArcPath = (startAngle, endAngle) => {
    const startAngleRad = (startAngle - 180) * Math.PI / 180;
    const endAngleRad = (endAngle - 180) * Math.PI / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };
  
  // Format display value
  const getDisplayValue = () => {
    if (customDisplay) {
      return customDisplay(clampedValue);
    }
    switch (displayType) {
      case 'percentage':
        return `${percentage.toFixed(0)}%`;
      case 'value':
        return clampedValue % 1 === 0 ? clampedValue.toString() : clampedValue.toFixed(1);
      default:
        return `${percentage.toFixed(0)}%`;
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Define masks and filters for contrast effect */}
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feMorphology operator="dilate" radius="3" result="expanded"/>
            <feFlood flood-color="white" result="white"/>
            <feComposite in="white" in2="expanded" operator="in" result="whiteBorder"/>
            <feMerge>
              <feMergeNode in="whiteBorder"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Gauge segments */}
        {colorSegments.map((segment, index) => (
          <path
            key={index}
            d={createArcPath(segment.startAngle, segment.endAngle)}
            fill={segment.color}
            opacity="0.9"
          />
        ))}
        
        {/* Inner white arc to create donut effect */}
        <path
          d={`M ${centerX - innerRadius} ${centerY} A ${innerRadius} ${innerRadius} 0 0 1 ${centerX + innerRadius} ${centerY}`}
          fill="white"
          stroke="none"
        />
        
        {/* Tick marks and labels */}
        {ticks.map((tick) => {
          const angleRad = (tick.angle - 180) * Math.PI / 180;
          const x1 = centerX + (radius + 5) * Math.cos(angleRad);
          const y1 = centerY + (radius + 5) * Math.sin(angleRad);
          const x2 = centerX + (radius - 5) * Math.cos(angleRad);
          const y2 = centerY + (radius - 5) * Math.sin(angleRad);
          const labelX = centerX + (radius + 20) * Math.cos(angleRad);
          const labelY = centerY + (radius + 20) * Math.sin(angleRad);
          
          return (
            <g key={tick.value}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#374151"
                strokeWidth="2"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-medium fill-gray-600"
              >
                {tick.value}
              </text>
            </g>
          );
        })}
        
        {/* Needle */}
        <g transform={`rotate(${needleAngle} ${centerX} ${centerY})`}>
          {/* Needle triangle */}
          <path
            d={`M ${centerX - radius * 0.7} ${centerY} L ${centerX - radius * 0.15} ${centerY - 6} L ${centerX - radius * 0.15} ${centerY + 6} Z`}
            fill="#1f2937"
          />
          {/* Needle circle center */}
          <circle
            cx={centerX}
            cy={centerY}
            r="12"
            fill="#1f2937"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            fill="white"
          />
        </g>
        
        {/* Value display with white outline */}
        <text
          x={centerX}
          y={centerY - 40}
          textAnchor="middle"
          className="text-2xl font-bold fill-gray-800"
          filter={`url(#${filterId})`}
        >
          {getDisplayValue()}
        </text>
        
        {/* Label */}
        {label && (
          <text
            x={centerX}
            y={centerY + 30}
            textAnchor="middle"
            className="text-lg font-medium fill-gray-600"
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
};

// Example usage with different configurations
export default function App() {
  const [value1, setValue1] = React.useState(3.5);
  const [value2, setValue2] = React.useState(7);
  const [value3, setValue3] = React.useState(75);
  const [value4, setValue4] = React.useState(3.2);
  
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">React Gauge Component</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Percentage display */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Percentage Display (0-5)</h2>
          <Gauge 
            value={value1} 
            min={0}
            max={5}
            label="Performance"
            displayType="percentage"
            tickInterval={1}
          />
          <div className="mt-4">
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={value1}
              onChange={(e) => setValue1(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-center mt-2 text-gray-600">Value: {value1}</p>
          </div>
        </div>
        
        {/* Value display 0-10 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Value Display (0-10)</h2>
          <Gauge 
            value={value2} 
            min={0}
            max={10}
            label="Score"
            displayType="value"
            tickInterval={2}
            colors={['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']}
          />
          <div className="mt-4">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={value2}
              onChange={(e) => setValue2(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-center mt-2 text-gray-600">Value: {value2}</p>
          </div>
        </div>
        
        {/* Custom display 0-100 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Custom Display (0-100)</h2>
          <Gauge 
            value={value3} 
            min={0}
            max={100}
            label="Progress"
            displayType="custom"
            customDisplay={(val) => `${Math.round(val)} pts`}
            tickInterval={20}
            thickness={50}
            colors={['#dc2626', '#f59e0b', '#eab308', '#84cc16', '#22c55e']}
          />
          <div className="mt-4">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={value3}
              onChange={(e) => setValue3(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-center mt-2 text-gray-600">Value: {value3}</p>
          </div>
        </div>
        
        {/* 1-5 rating scale */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Rating Scale (1-5)</h2>
          <Gauge 
            value={value4} 
            min={1}
            max={5}
            label="Customer Rating"
            displayType="value"
            tickInterval={1}
            size={250}
            thickness={30}
            colors={['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e']}
          />
          <div className="mt-4">
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={value4}
              onChange={(e) => setValue4(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-center mt-2 text-gray-600">Value: {value4}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Component Props</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Basic Props:</h3>
            <ul className="space-y-2 text-gray-600">
              <li><code className="bg-gray-100 px-1 rounded">value</code> - Current value</li>
              <li><code className="bg-gray-100 px-1 rounded">min</code> - Minimum value (default: 0)</li>
              <li><code className="bg-gray-100 px-1 rounded">max</code> - Maximum value (default: 5)</li>
              <li><code className="bg-gray-100 px-1 rounded">label</code> - Text label below gauge</li>
              <li><code className="bg-gray-100 px-1 rounded">size</code> - Width in pixels (default: 300)</li>
              <li><code className="bg-gray-100 px-1 rounded">thickness</code> - Arc thickness (default: 40)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Display Options:</h3>
            <ul className="space-y-2 text-gray-600">
              <li><code className="bg-gray-100 px-1 rounded">displayType</code> - 'percentage', 'value', or 'custom'</li>
              <li><code className="bg-gray-100 px-1 rounded">customDisplay</code> - Function to format display</li>
              <li><code className="bg-gray-100 px-1 rounded">tickInterval</code> - Interval between ticks (default: 1)</li>
              <li><code className="bg-gray-100 px-1 rounded">showTicks</code> - Show tick marks (default: true)</li>
              <li><code className="bg-gray-100 px-1 rounded">colors</code> - Array of segment colors</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Example Usage:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
{`<Gauge 
  value={7.5}
  min={0}
  max={10}
  label="Score"
  displayType="value"      // Show actual value
  tickInterval={2}         // Ticks at 0, 2, 4, 6, 8, 10
  thickness={50}           // Thicker gauge arc
  customDisplay={(val) => \`\${val.toFixed(1)} / 10\`}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
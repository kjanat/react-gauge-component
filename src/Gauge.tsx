import React from "react";

export interface GaugeProps {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
  displayType?: "percentage" | "value" | "custom";
  customDisplay?: (value: number) => string;
  tickInterval?: number;
  showTicks?: boolean;
  colors?: string[];
  size?: number;
  thickness?: number;
  className?: string;
}

const Gauge: React.FC<GaugeProps> = ({
  value = 2.5,
  min = 0,
  max = 5,
  label = "",
  displayType = "percentage",
  customDisplay = null,
  tickInterval = 1,
  showTicks = true,
  colors = ["#22c55e", "#10b981", "#84cc16", "#eab308", "#f59e0b", "#ef4444"],
  size = 300,
  thickness = 40,
  className = "",
}) => {
  const uniqueId = React.useId();
  const filterId = `invert-${uniqueId}`;

  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;
  const needleAngle = (percentage / 100) * 180;

  const width = size;
  const height = size / 2 + 60; // Increased to accommodate label
  const centerX = width / 2;
  const centerY = height - 40; // Adjusted to leave room for label
  const radius = width / 2 - 30;
  const innerRadius = radius - thickness;

  const ticks: Array<{ value: number; angle: number }> = [];
  if (showTicks) {
    let tickValue = Math.ceil(min / tickInterval) * tickInterval;
    if (tickValue < min) tickValue = min;

    while (tickValue <= max) {
      const tickPercentage = ((tickValue - min) / (max - min)) * 100;
      const tickAngle = (tickPercentage / 100) * 180;
      ticks.push({ value: tickValue, angle: tickAngle });
      tickValue += tickInterval;
    }

    if (ticks.length === 0 || ticks[0].value !== min) {
      ticks.unshift({ value: min, angle: 0 });
    }
    if (ticks[ticks.length - 1].value !== max) {
      ticks.push({ value: max, angle: 180 });
    }
  }

  const colorSegments: Array<{
    color: string;
    startAngle: number;
    endAngle: number;
  }> = [];
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
        endAngle,
      });
    }
  }

  const createArcPath = (startAngle: number, endAngle: number): string => {
    const startAngleRad = ((startAngle - 180) * Math.PI) / 180;
    const endAngleRad = ((endAngle - 180) * Math.PI) / 180;

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

  const getDisplayValue = (): string => {
    if (customDisplay) {
      return customDisplay(clampedValue);
    }
    switch (displayType) {
      case "percentage":
        return `${percentage.toFixed(0)}%`;
      case "value":
        return clampedValue % 1 === 0 ? clampedValue.toString() : clampedValue.toFixed(1);
      default:
        return `${percentage.toFixed(0)}%`;
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        role="img"
        aria-label="Gauge chart"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feMorphology operator="dilate" radius="3" result="expanded" />
            <feFlood floodColor="white" result="white" />
            <feComposite in="white" in2="expanded" operator="in" result="whiteBorder" />
            <feMerge>
              <feMergeNode in="whiteBorder" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {colorSegments.map((segment, index) => (
          <path
            key={index}
            d={createArcPath(segment.startAngle, segment.endAngle)}
            fill={segment.color}
            opacity="0.9"
          />
        ))}

        <path
          d={`M ${centerX - innerRadius} ${centerY} A ${innerRadius} ${innerRadius} 0 0 1 ${centerX + innerRadius} ${centerY}`}
          fill="white"
          stroke="none"
        />

        {ticks.map((tick) => {
          const angleRad = ((tick.angle - 180) * Math.PI) / 180;
          const x1 = centerX + (radius + 5) * Math.cos(angleRad);
          const y1 = centerY + (radius + 5) * Math.sin(angleRad);
          const x2 = centerX + (radius - 5) * Math.cos(angleRad);
          const y2 = centerY + (radius - 5) * Math.sin(angleRad);
          const labelX = centerX + (radius + 20) * Math.cos(angleRad);
          const labelY = centerY + (radius + 20) * Math.sin(angleRad);

          return (
            <g key={tick.value}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="2" />
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

        <g transform={`rotate(${needleAngle} ${centerX} ${centerY})`}>
          <path
            d={`M ${centerX - radius * 0.7} ${centerY} L ${centerX - radius * 0.15} ${centerY - 6} L ${centerX - radius * 0.15} ${centerY + 6} Z`}
            fill="#1f2937"
          />
          <circle cx={centerX} cy={centerY} r="12" fill="#1f2937" />
          <circle cx={centerX} cy={centerY} r="8" fill="white" />
        </g>

        <text
          x={centerX}
          y={centerY - 40}
          textAnchor="middle"
          className="text-2xl font-bold fill-gray-800"
          filter={`url(#${filterId})`}
        >
          {getDisplayValue()}
        </text>

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

export default Gauge;

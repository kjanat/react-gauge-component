import React from "react";

export type DisplayType = "percentage" | "value" | "custom";

export interface ThemeColors {
  /** Background color for inner arc (default: white in light, #1f2937 in dark) */
  background?: string;
  /** Color for tick marks (default: #374151 in light, #9ca3af in dark) */
  tickColor?: string;
  /** Color for needle body (default: #1f2937 in light, #e5e7eb in dark) */
  needleColor?: string;
  /** Color for needle center dot (default: white in light, #374151 in dark) */
  needleCenter?: string;
  /** Color for text outline effect (default: white in light, black in dark) */
  textOutline?: string;
  /** Color for value text over gauge background (default: contrasts with background) */
  valueTextColor?: string;
}

export interface GaugeProps {
  /** Current value to display on the gauge (default: 2.5) */
  value?: number;
  /** Minimum value of the gauge range (default: 0) */
  min?: number;
  /** Maximum value of the gauge range (default: 5) */
  max?: number;
  /** Label text to display below the gauge */
  label?: string;
  /** How to display the value: percentage, raw value, or custom format (default: "percentage") */
  displayType?: DisplayType;
  /** Custom function to format the display value (required when displayType is "custom") */
  customDisplay?: (value: number) => string;
  /** Interval between tick marks (default: 1) */
  tickInterval?: number;
  /** Whether to show tick marks and labels (default: true) */
  showTicks?: boolean;
  /** Array of colors for gauge segments (default: green to red gradient) */
  colors?: string[];
  /** Width of the gauge in pixels (default: 300) */
  size?: number;
  /** Thickness of the gauge arc in pixels (default: 40) */
  thickness?: number;
  /** Additional CSS classes to apply to the wrapper */
  className?: string;
  /** Theme colors for light mode */
  lightTheme?: ThemeColors;
  /** Theme colors for dark mode */
  darkTheme?: ThemeColors;
  /** Automatically detect and apply dark mode (default: true) */
  autoDetectTheme?: boolean;
  /** Show text outline effect on value text (default: true) */
  showTextOutline?: boolean;
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
  lightTheme = {},
  darkTheme = {},
  autoDetectTheme = true,
  showTextOutline = true,
}) => {
  const uniqueId = React.useId();
  const filterId = `invert-${uniqueId}`;

  // Default theme configurations
  const defaultLightTheme: ThemeColors = {
    background: "white",
    tickColor: "#374151",
    needleColor: "#1f2937",
    needleCenter: "white",
    textOutline: "white", // Matches the default light background
    valueTextColor: "#1f2937", // Dark text on white background
  };

  const defaultDarkTheme: ThemeColors = {
    background: "#1f2937",
    tickColor: "#9ca3af",
    needleColor: "#e5e7eb",
    needleCenter: "#374151",
    textOutline: "#1f2937", // gray-800 - matches the dark mode card background
    valueTextColor: "#f9fafb", // Light text on dark background
  };

  // Detect dark mode
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (!autoDetectTheme) return;

    const checkDarkMode = () => {
      // Priority order:
      // 1. If 'dark' class exists on html/body -> dark mode
      // 2. If 'light' class exists on html/body -> light mode  
      // 3. Otherwise use system preference
      
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      if (htmlElement.classList.contains("dark") || bodyElement.classList.contains("dark")) {
        setIsDarkMode(true);
      } else if (htmlElement.classList.contains("light") || bodyElement.classList.contains("light")) {
        setIsDarkMode(false);
      } else {
        // No explicit class, use system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);
      }
    };

    checkDarkMode();

    // Listen for class changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkDarkMode);
    };
  }, [autoDetectTheme]);

  // Merge themes with defaults
  const currentLightTheme = { ...defaultLightTheme, ...lightTheme };
  const currentDarkTheme = { ...defaultDarkTheme, ...darkTheme };
  const activeTheme = isDarkMode ? currentDarkTheme : currentLightTheme;

  // Helper function to get contrasting color
  const getContrastingColor = (bgColor: string): string => {
    // Simple approach: known light colors get dark text, dark colors get light text
    const lightColors = ["white", "#ffffff", "#fff", "#f9fafb", "#f3f4f6", "#e5e7eb"];
    const isLightBg = lightColors.includes(bgColor.toLowerCase());
    return isLightBg ? "#1f2937" : "#f9fafb";
  };

  // Determine value text color
  const valueTextColor = activeTheme.valueTextColor || 
    getContrastingColor(activeTheme.background || defaultLightTheme.background!);

  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;
  const needleAngle = (percentage / 100) * 180;

  // Handle empty colors array gracefully
  const safeColors = colors.length > 0 ? colors : ["#6b7280"];

  const padding = 10; // Extra padding for edge labels
  const width = size + padding * 2;
  const height = size / 2 + 60; // Increased to accommodate label
  const centerX = width / 2;
  const centerY = height - 40; // Adjusted to leave room for label
  const radius = (width - padding * 2) / 2 - 30;
  const innerRadius = radius - thickness;

  const ticks: Array<{ value: number; angle: number }> = [];
  if (showTicks) {
    let tickValue = Math.ceil(min / tickInterval) * tickInterval;

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
    const segmentCount = Math.min(safeColors.length, ticks.length - 1);
    for (let i = 0; i < segmentCount; i++) {
      const startPercent = (i / segmentCount) * 100;
      const endPercent = ((i + 1) / segmentCount) * 100;
      const startAngle = (startPercent / 100) * 180;
      const endAngle = (endPercent / 100) * 180;
      colorSegments.push({
        color: safeColors[i],
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

    const largeArcFlag = 0; // Semicircle gauge never exceeds 180 degrees

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
    <div className={`flex flex-col items-center ${className}`} style={{ color: isDarkMode ? '#e5e7eb' : '#374151' }}>
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
            <feFlood floodColor={activeTheme.textOutline} result="outline" />
            <feComposite in="outline" in2="expanded" operator="in" result="outlineBorder" />
            <feMerge>
              <feMergeNode in="outlineBorder" />
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
          fill={activeTheme.background}
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
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={activeTheme.tickColor} strokeWidth="2" />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-medium"
                fill="currentColor"
              >
                {tick.value}
              </text>
            </g>
          );
        })}

        <g transform={`rotate(${needleAngle} ${centerX} ${centerY})`}>
          <path
            d={`M ${centerX - radius * 0.7} ${centerY} L ${centerX - radius * 0.15} ${centerY - 6} L ${centerX - radius * 0.15} ${centerY + 6} Z`}
            fill={activeTheme.needleColor}
          />
          <circle cx={centerX} cy={centerY} r="12" fill={activeTheme.needleColor} />
          <circle cx={centerX} cy={centerY} r="8" fill={activeTheme.needleCenter} />
        </g>

        <text
          x={centerX}
          y={centerY - 40}
          textAnchor="middle"
          className="text-2xl font-bold"
          fill={valueTextColor}
          filter={showTextOutline ? `url(#${filterId})` : undefined}
        >
          {getDisplayValue()}
        </text>

        {label && (
          <text
            x={centerX}
            y={centerY + 30}
            textAnchor="middle"
            className="text-lg font-medium"
            fill="currentColor"
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
};

export default Gauge;

# React Gauge Component

A customizable, animated gauge/speedometer component for React applications. Perfect for dashboards, analytics displays, and progress indicators.

<!-- ![React Gauge Component Demo](<image-link>) -->

## Features

- 🎨 Fully customizable appearance
- 📊 Multiple display modes (percentage, value, custom)
- 🌈 Configurable color segments
- 📏 Adjustable size and thickness
- 🎯 Smooth needle animations
- 📱 Responsive design
- 💪 TypeScript support
- 🪶 Lightweight with no dependencies

## Installation (NOT YET PUBLISHED TO NPM, DOESN'T WORK YET)

```bash
npm install @kjanat/react-gauge-component
# or
yarn add @kjanat/react-gauge-component
# or
pnpm add @kjanat/react-gauge-component
```

## Quick Start

```jsx
import { Gauge } from '@kjanat/react-gauge-component';
import '@kjanat/react-gauge-component/dist/styles.css';

function App() {
  return (
    <Gauge
      value={75}
      min={0}
      max={100}
      label="Performance"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `2.5` | Current value to display |
| `min` | `number` | `0` | Minimum value of the gauge |
| `max` | `number` | `5` | Maximum value of the gauge |
| `label` | `string` | `''` | Label text displayed below the gauge |
| `displayType` | `'percentage' \| 'value' \| 'custom'` | `'percentage'` | How to display the current value |
| `customDisplay` | `(value: number) => string` | `null` | Custom function to format the display value |
| `tickInterval` | `number` | `1` | Interval between tick marks |
| `showTicks` | `boolean` | `true` | Whether to show tick marks and labels |
| `colors` | `string[]` | `['#22c55e', '#10b981', '#84cc16', '#eab308', '#f59e0b', '#ef4444']` | Array of colors for gauge segments |
| `size` | `number` | `300` | Width of the gauge in pixels |
| `thickness` | `number` | `40` | Thickness of the gauge arc |
| `className` | `string` | `''` | Additional CSS class for styling |

## Examples

### Basic Usage

```jsx
<Gauge
  value={3.5}
  min={0}
  max={5}
  label="Score"
/>
```

### Percentage Display

```jsx
<Gauge
  value={75}
  min={0}
  max={100}
  label="Progress"
  displayType="percentage"
/>
```

### Custom Display Format

```jsx
<Gauge
  value={85}
  min={0}
  max={100}
  label="Speed"
  displayType="custom"
  customDisplay={(val) => `${val} km/h`}
/>
```

### Custom Colors

```jsx
<Gauge
  value={7}
  min={0}
  max={10}
  label="Rating"
  colors={['#ef4444', '#f59e0b', '#22c55e']}
  tickInterval={2}
/>
```

### Different Sizes

```jsx
// Small gauge
<Gauge value={50} size={200} thickness={30} />

// Large gauge
<Gauge value={50} size={400} thickness={60} />
```

## Styling

The component comes with default styles that you need to import:

```jsx
import '@kjanat/react-gauge-component/dist/styles.css';
```

You can override the default styles using the `className` prop or by targeting the component's CSS classes:

- `.gauge-container` - Main container
- `.gauge-svg` - SVG element
- `.gauge-tick-label` - Tick mark labels
- `.gauge-value` - Value display
- `.gauge-label` - Label text

## Development

```bash
# Install dependencies
pnpm install

# Run development server with examples
pnpm dev

# Build the library
pnpm build:lib

# Type checking
pnpm type-check
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT © Kaj Kowalski

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

### 1.0.0
- Initial release
- Basic gauge functionality
- TypeScript support
- Multiple display modes
- Customizable colors and sizes

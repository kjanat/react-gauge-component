import React from "react";
import ReactDOM from "react-dom/client";
import { Gauge } from "../src";
import "./App.css";

function App() {
  const [value1, setValue1] = React.useState(3.5);
  const [value2, setValue2] = React.useState(7);
  const [value3, setValue3] = React.useState(75);
  const [value4, setValue4] = React.useState(3.2);

  return (
    <div className="app">
      <h1>React Gauge Component Examples</h1>

      <div className="examples-grid">
        <div className="example-card">
          <h2>Percentage Display (0-5)</h2>
          <Gauge
            value={value1}
            min={0}
            max={5}
            label="Performance"
            displayType="percentage"
            tickInterval={1}
          />
          <div className="controls">
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={value1}
              onChange={(e) => setValue1(parseFloat(e.target.value))}
            />
            <p>Value: {value1}</p>
          </div>
        </div>

        <div className="example-card">
          <h2>Value Display (0-10)</h2>
          <Gauge
            value={value2}
            min={0}
            max={10}
            label="Score"
            displayType="value"
            tickInterval={2}
            colors={["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]}
          />
          <div className="controls">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={value2}
              onChange={(e) => setValue2(parseFloat(e.target.value))}
            />
            <p>Value: {value2}</p>
          </div>
        </div>

        <div className="example-card">
          <h2>Custom Display (0-100)</h2>
          <Gauge
            value={value3}
            min={0}
            max={100}
            label="Progress"
            displayType="custom"
            customDisplay={(val) => `${Math.round(val)} pts`}
            tickInterval={20}
            thickness={50}
            colors={["#dc2626", "#f59e0b", "#eab308", "#84cc16", "#22c55e"]}
          />
          <div className="controls">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={value3}
              onChange={(e) => setValue3(parseFloat(e.target.value))}
            />
            <p>Value: {value3}</p>
          </div>
        </div>

        <div className="example-card">
          <h2>Rating Scale (1-5)</h2>
          <Gauge
            value={value4}
            min={1}
            max={5}
            label="Customer Rating"
            displayType="value"
            tickInterval={1}
            size={250}
            thickness={30}
            colors={["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e"]}
          />
          <div className="controls">
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={value4}
              onChange={(e) => setValue4(parseFloat(e.target.value))}
            />
            <p>Value: {value4}</p>
          </div>
        </div>
      </div>

      <div className="props-documentation">
        <h2>Component Props</h2>
        <div className="props-grid">
          <div>
            <h3>Basic Props:</h3>
            <ul>
              <li>
                <code>value</code> - Current value
              </li>
              <li>
                <code>min</code> - Minimum value (default: 0)
              </li>
              <li>
                <code>max</code> - Maximum value (default: 5)
              </li>
              <li>
                <code>label</code> - Text label below gauge
              </li>
              <li>
                <code>size</code> - Width in pixels (default: 300)
              </li>
              <li>
                <code>thickness</code> - Arc thickness (default: 40)
              </li>
            </ul>
          </div>
          <div>
            <h3>Display Options:</h3>
            <ul>
              <li>
                <code>displayType</code> - 'percentage', 'value', or 'custom'
              </li>
              <li>
                <code>customDisplay</code> - Function to format display
              </li>
              <li>
                <code>tickInterval</code> - Interval between ticks (default: 1)
              </li>
              <li>
                <code>showTicks</code> - Show tick marks (default: true)
              </li>
              <li>
                <code>colors</code> - Array of segment colors
              </li>
            </ul>
          </div>
        </div>

        <div className="example-usage">
          <h3>Example Usage:</h3>
          <pre>
            {`import { Gauge } from '@kjanat/react-gauge-component';

<Gauge 
  value={7.5}
  min={0}
  max={10}
  label="Score"
  displayType="value"
  tickInterval={2}
  thickness={50}
  customDisplay={(val) => \`\${val.toFixed(1)} / 10\`}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

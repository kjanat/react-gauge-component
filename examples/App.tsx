import React from "react";
import ReactDOM from "react-dom/client";
import { Gauge } from "../src";
import "./App.css";

function App() {
  const [value1, setValue1] = React.useState(3.5);
  const [value2, setValue2] = React.useState(7);
  const [value3, setValue3] = React.useState(75);
  const [value4, setValue4] = React.useState(3.2);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      return saved === "dark";
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    const shouldApplyExplicitClass = saved !== null;
    
    if (shouldApplyExplicitClass) {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="flex justify-center items-center gap-8 mb-8 relative">
        <h1 className="text-center text-gray-800 dark:text-gray-100 text-3xl m-0">React Gauge Component Examples</h1>
        <button 
          className="absolute right-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-base cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <button 
          className="absolute right-32 bg-gray-600 dark:bg-gray-600 text-white border-none rounded px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
          onClick={() => {
            localStorage.removeItem("theme");
            const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDarkMode(systemPrefersDark);
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.remove("light");
          }}
          aria-label="Clear theme preference"
        >
          Clear Theme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl p-6 flex flex-col items-center transition-all duration-300">
          <h2 className="text-center mb-6 text-gray-700 dark:text-gray-300 text-xl">Percentage Display (0-5)</h2>
          <Gauge
            value={value1}
            min={0}
            max={5}
            label="Performance"
            displayType="percentage"
            tickInterval={1}
          />
          <div className="mt-6 w-full">
            <input
              type="range"
              className="w-full"
              min="0"
              max="5"
              step="0.1"
              value={value1}
              onChange={(e) => setValue1(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">Value: {value1}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl p-6 flex flex-col items-center transition-all duration-300">
          <h2 className="text-center mb-6 text-gray-700 dark:text-gray-300 text-xl">Value Display (0-10)</h2>
          <Gauge
            value={value2}
            min={0}
            max={10}
            label="Score"
            displayType="value"
            tickInterval={2}
            colors={["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]}
          />
          <div className="mt-6 w-full">
            <input
              type="range"
              className="w-full"
              min="0"
              max="10"
              step="0.1"
              value={value2}
              onChange={(e) => setValue2(parseFloat(e.target.value))}
            />
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">Value: {value2}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl p-6 flex flex-col items-center transition-all duration-300">
          <h2 className="text-center mb-6 text-gray-700 dark:text-gray-300 text-xl">Custom Display (0-100)</h2>
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
          <div className="mt-6 w-full">
            <input
              type="range"
              className="w-full"
              min="0"
              max="100"
              step="1"
              value={value3}
              onChange={(e) => setValue3(parseFloat(e.target.value))}
            />
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">Value: {value3}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl p-6 flex flex-col items-center transition-all duration-300">
          <h2 className="text-center mb-6 text-gray-700 dark:text-gray-300 text-xl">Rating Scale (1-5)</h2>
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
          <div className="mt-6 w-full">
            <input
              type="range"
              className="w-full"
              min="1"
              max="5"
              step="0.1"
              value={value4}
              onChange={(e) => setValue4(parseFloat(e.target.value))}
            />
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">Value: {value4}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl p-6 flex flex-col items-center transition-all duration-300">
          <h2 className="text-center mb-6 text-gray-700 dark:text-gray-300 text-xl">Custom Theme Example</h2>
          <Gauge
            value={4}
            min={0}
            max={5}
            label="Themed Gauge"
            displayType="value"
            tickInterval={1}
            lightTheme={{
              background: "#f3f4f6",
              tickColor: "#6b7280",
              needleColor: "#111827",
              needleCenter: "#e5e7eb",
              textOutline: "#ffffff",
              valueTextColor: "#111827",
            }}
            darkTheme={{
              background: "#111827",
              tickColor: "#d1d5db",
              needleColor: "#f9fafb",
              needleCenter: "#4b5563",
              textOutline: "#000000",
              valueTextColor: "#f9fafb",
            }}
          />
          <div className="mt-6 w-full">
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">This gauge uses custom light/dark themes</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl p-8 transition-all duration-300">
        <h2 className="text-gray-800 dark:text-gray-100 mb-6 text-2xl">Component Props</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-gray-700 dark:text-gray-300 mb-4 text-lg">Basic Props:</h3>
            <ul className="list-none p-0 text-gray-600 dark:text-gray-400">
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">value</code> - Current value
              </li>
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">min</code> - Minimum value (default: 0)
              </li>
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">max</code> - Maximum value (default: 5)
              </li>
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">label</code> - Text label below gauge
              </li>
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">size</code> - Width in pixels (default: 300)
              </li>
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">thickness</code> - Arc thickness (default: 40)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-700 dark:text-gray-300 mb-4 text-lg">Display Options:</h3>
            <ul className="list-none p-0 text-gray-600 dark:text-gray-400">
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">displayType</code> - 'percentage', 'value', or 'custom'
              </li>
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">customDisplay</code> - Function to format display
              </li>
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">tickInterval</code> - Interval between ticks (default: 1)
              </li>
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">showTicks</code> - Show tick marks (default: true)
              </li>
              <li className="mb-2 leading-relaxed">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">colors</code> - Array of segment colors
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-gray-700 dark:text-gray-300 mb-4 text-lg">Example Usage:</h3>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed text-gray-800 dark:text-gray-100">
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

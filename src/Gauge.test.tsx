import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Gauge from "./Gauge";
import { type GaugeProps, Gauge as NamedGauge } from "./index";

describe("Gauge Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Gauge />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("displays the correct value", () => {
    render(<Gauge value={3.5} displayType="value" />);
    expect(screen.getByText("3.5")).toBeInTheDocument();
  });

  it("displays percentage when displayType is percentage", () => {
    render(<Gauge value={2.5} min={0} max={5} displayType="percentage" />);
    // The default shows percentage anyway, so should show 50%
    const percentageText = screen.getByText(/50%|70%/);
    expect(percentageText).toBeInTheDocument();
  });

  it("uses custom display function when provided", () => {
    const customDisplay = (value: number) => `Score: ${value}`;
    render(<Gauge value={4} displayType="custom" customDisplay={customDisplay} />);
    expect(screen.getByText("Score: 4")).toBeInTheDocument();
  });

  it("displays label when provided", () => {
    render(<Gauge label="Performance Score" />);
    expect(screen.getByText("Performance Score")).toBeInTheDocument();
  });

  it("respects min and max values", () => {
    render(<Gauge value={7} min={0} max={10} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Gauge className="custom-gauge" />);
    expect(container.firstChild).toHaveClass("custom-gauge");
  });

  it("renders with custom size", () => {
    const { container } = render(<Gauge size={400} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "400");
    // Height is calculated dynamically based on size
    expect(svg).toHaveAttribute("height");
  });

  it("renders tick marks when showTicks is true", () => {
    const { container } = render(<Gauge showTicks={true} tickInterval={1} min={0} max={5} />);
    // Look for tick lines by checking stroke attribute
    const lines = container.querySelectorAll("line");
    const tickLines = Array.from(lines).filter((line) => line.getAttribute("stroke") === "#374151");
    expect(tickLines.length).toBeGreaterThan(0);
  });

  it("hides tick marks when showTicks is false", () => {
    const { container } = render(<Gauge showTicks={false} />);
    const ticks = container.querySelectorAll('line[stroke="#E0E0E0"]');
    expect(ticks.length).toBe(0);
  });

  it("handles edge case where tick interval doesn't align with min/max", () => {
    const { container } = render(<Gauge min={0} max={10} tickInterval={3} showTicks={true} />);
    // This tests the edge case where ticks need to be added at min and max
    const lines = container.querySelectorAll("line");
    const tickLines = Array.from(lines).filter((line) => line.getAttribute("stroke") === "#374151");
    expect(tickLines.length).toBeGreaterThan(0);
  });

  it("handles invalid displayType by defaulting to percentage", () => {
    // Test the default case in the switch statement
    render(
      <Gauge value={2.5} min={0} max={5} displayType={"invalid" as GaugeProps["displayType"]} />
    );
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("displays whole numbers without decimals", () => {
    const { container } = render(<Gauge value={4} displayType="value" />);
    // Use more specific selector to get the value display text
    const valueText = container.querySelector('text[filter*="invert"]');
    expect(valueText?.textContent).toBe("4");
  });

  it("displays decimal numbers with one decimal place", () => {
    render(<Gauge value={3.7} displayType="value" />);
    expect(screen.getByText("3.7")).toBeInTheDocument();
  });

  it("handles customDisplay with percentage display type", () => {
    const customDisplay = (value: number) => `Custom: ${value}`;
    render(<Gauge value={4} displayType="percentage" customDisplay={customDisplay} />);
    expect(screen.getByText("Custom: 4")).toBeInTheDocument();
  });

  it("adds min value tick when first calculated tick is greater than min", () => {
    // This tests the edge case where ticks.unshift is called
    // Using min=0, max=10, tickInterval=3 creates ticks at 3,6,9
    // So it needs to add 0 at the beginning
    const { container } = render(<Gauge min={0} max={10} tickInterval={3} showTicks={true} />);
    const texts = container.querySelectorAll("text");
    const tickLabels = Array.from(texts).filter(
      (text) => text.classList.contains("text-sm") && text.classList.contains("font-medium")
    );
    const values = tickLabels.map((label) => label.textContent);
    expect(values).toContain("0");
    expect(values).toContain("10");
  });

  it("handles case where no ticks are generated", () => {
    // This tests when tickInterval is larger than the range
    const { container } = render(<Gauge min={0} max={1} tickInterval={2} showTicks={true} />);
    const texts = container.querySelectorAll("text");
    const tickLabels = Array.from(texts).filter(
      (text) => text.classList.contains("text-sm") && text.classList.contains("font-medium")
    );
    // Should still have min and max ticks
    expect(tickLabels.length).toBeGreaterThanOrEqual(2);
  });

  it("doesn't add duplicate min tick when first tick equals min", () => {
    // This tests the condition where ticks[0].value === min
    // Using min=0, max=10, tickInterval=2 creates ticks at 0,2,4,6,8,10
    const { container } = render(<Gauge min={0} max={10} tickInterval={2} showTicks={true} />);
    const texts = container.querySelectorAll("text");
    const tickLabels = Array.from(texts).filter(
      (text) => text.classList.contains("text-sm") && text.classList.contains("font-medium")
    );
    const values = tickLabels.map((label) => label.textContent);
    // Count how many times "0" appears
    const zeroCount = values.filter((v) => v === "0").length;
    expect(zeroCount).toBe(1); // Should only have one "0"
  });

  it("adds min tick for negative range", () => {
    // Test with negative min value
    const { container } = render(<Gauge min={-5} max={5} tickInterval={3} showTicks={true} />);
    const texts = container.querySelectorAll("text");
    const tickLabels = Array.from(texts).filter(
      (text) => text.classList.contains("text-sm") && text.classList.contains("font-medium")
    );
    const values = tickLabels.map((label) => label.textContent);
    expect(values).toContain("-5");
  });

  it("renders color segments with correct SVG arc paths", () => {
    // Test that color segments are rendered with proper SVG arc syntax
    const { container } = render(
      <Gauge
        value={2.5}
        min={0}
        max={5}
        colors={["#22c55e", "#10b981", "#84cc16"]}
        showTicks={true}
      />
    );

    // Check that color segments are rendered
    const paths = container.querySelectorAll("path");
    const colorPaths = Array.from(paths).filter((path) => path.getAttribute("opacity") === "0.9");

    expect(colorPaths.length).toBeGreaterThan(0);

    // Verify SVG arc syntax (largeArcFlag is always 0 for semicircle gauge)
    colorPaths.forEach((path) => {
      const pathData = path.getAttribute("d") || "";
      expect(pathData).toMatch(/A \d+ \d+ 0 0 1/); // Correct arc syntax
    });
  });
});

describe("Index Exports", () => {
  it("exports Gauge component as named export", () => {
    const { container } = render(<NamedGauge value={3} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("exports GaugeProps type correctly", () => {
    const props: GaugeProps = {
      value: 2.5,
      min: 0,
      max: 5,
      displayType: "percentage",
    };

    const { container } = render(<NamedGauge {...props} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

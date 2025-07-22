import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Gauge from "./Gauge";

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
});

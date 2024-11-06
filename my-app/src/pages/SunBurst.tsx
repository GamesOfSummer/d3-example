import React, { useEffect, useRef, useState } from "react";

import * as d3 from "d3";

import data from "./sunburst.json";

export default function SunBurst() {
  const containerRef = useRef(null);
  useEffect(() => {
    drawChart();
  }, []);

  function drawChart() {
    // Specify the chart’s dimensions.
    const width = 558;
    const height = 900;
    const radius = width / 6;

    // Compute the layout.
    const hierarchy = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    const root = d3.partition().size([2 * Math.PI, hierarchy.height + 1])(
      hierarchy
    );

    root.each((d) => (d.current = d));

    // Create the arc generator.
    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 2)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("height", "1200")
      .attr("width", "800")
      .attr("viewBox", `0 0 800 1200`)
      .append("g")
      .attr("transform", "translate(" + 400 + "," + 400 + ")");

    const color = d3
      .scaleSequential(d3.interpolateYlGn)
      .domain(d3.extent(root.descendants(), (d) => d.depth));

    // Append the arcs.
    svg
      .append("g")
      .selectAll("path")
      .data(root.descendants().filter((d) => d.depth))
      .join("path")
      .attr("fill", (d) => color(d.depth))
      .attr("d", arc);

    //labels
    svg
      .append("g")
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll()
      .data(root.descendants().filter((d) => d.depth))
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.name)
      );

    // Letter grade text
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 20)
      .text(`B+`)
      .style("font-size", "5.2em")
      .style("fill", "#A9BF51");
  }

  return (
    <div>
      <div ref={containerRef}></div>
    </div>
  );
}

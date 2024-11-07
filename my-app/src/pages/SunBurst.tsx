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
    const width = 928;
    const height = width;

    const tau = 2 * Math.PI;
    const maxValue = 100;
    const slice = 80;

    const innerRadius = 90,
      outerRadius = 120,
      startAngle = 0,
      cornerRadius = 40;

    const radius = 928 / 2;

    // Prepare the layout.
    const partition = (data) =>
      d3.partition().size([2 * Math.PI, radius])(
        d3
          .hierarchy(data)
          .count()
          .sum((d) => d.value)
      );

    console.log("-- partition");
    console.log(partition);

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1 - 1);

    console.log("-- arc");
    console.log(arc);

    const root = partition(data);

    console.log("-- root");
    console.log(root);

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("height", "60%")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const color = d3
      .scaleSequential(d3.interpolateYlGn)
      .domain(d3.extent(root.descendants(), (d) => d.depth));

    svg
      .append("g")
      .attr("fill-opacity", 0.6)
      .selectAll("path")
      .data(root.descendants().filter((d) => d.depth))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.depth))
      .append("title")
      .text(
        (d) => `Color: ${color(d.depth)}, Depth: ${d.depth}, Value: ${d.value}`
      );

    svg
      .append("g")
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll()
      .data(root.descendants().filter((d) => d.depth === 1))
      .join("rect")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .call((rect) => {
        rect
          .attr("x", -35) // Adjust to control position of the rectangle
          .attr("y", -20) // Adjust to control position of the rectangle
          .attr("width", 70) // Width of the rectangle
          .attr("height", 24) // Height of the rectangle
          .attr("rx", 12) // Curved corner radius (rounded corners)
          .attr("ry", 12) // Curved corner radius (rounded corners)
          .attr("fill", "#013220") // Rectangle background color (white)
          .attr("stroke", "black") // Border color (black)
          .attr("stroke-width", 1); // Border thickness
      });

    //labels
    svg
      .append("g")
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll()
      .data(root.descendants().filter((d) => d.depth === 1))
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.name)
      );

    // B text
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

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
      .scaleSequential(d3.interpolateBlues)
      .domain(d3.extent(root.descendants(), (d) => d.depth));

    console.log(color(0));
    console.log(color(4));

    svg
      .append("g")
      .selectAll("path")
      .data(root.descendants())
      .attr("fill", "rgb(8, 48, 107)")
      .attr("fill-opacity", (d) => 1)
      .join("path")
      .attr("d", arc)
      .append("title")
      .text(
        (d) => `Color: ${color(d.depth)}, Depth: ${d.depth}, Value: ${d.value}`
      );

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .text(`B+`)
      .style("font-size", "4.2em")
      .style("fill", "#A9BF51");
  }

  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = ((d.y0 + d.y1) / 2) * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  return (
    <div className="container">
      SUNBURST
      <div ref={containerRef}></div>
      <div className="slidecontainer">
        <div className="salesfigure"></div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";

import * as d3 from "d3";

import sunburstData from "./sunburst.json";

export default function SunBurst() {
  // const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  const containerRef = useRef(null);
  useEffect(() => {
    drawChart();
  }, []);

  function drawChart() {
    // Specify the chart’s dimensions.
    const width = 928;
    const height = width;
    const radius = width / 6;
    const tau = 2 * Math.PI;
    const maxValue = 100;
    const slice = 80;

    const innerRadius = 90,
      outerRadius = 120,
      startAngle = 0,
      cornerRadius = 40;

    d3.select("svg").remove();

    // Compute the layout.
    const hierarchy = d3.hierarchy(sunburstData);

    console.log(hierarchy);

    const root = d3.partition().size([2 * Math.PI, hierarchy.height + 1])(
      hierarchy
    );

    console.log("testing debug output");
    console.log(root);

    // An arc will be created
    // Create the arc generator.
    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const svg = d3
      .select(containerRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, width])
      .style("font", "10px sans-serif");

    // Create the color scale.
    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, sunburstData.length + 1)
    );

    // Append the arcs.
    const path = svg
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr("pointer-events", (d) => (arcVisible(d.current) ? "auto" : "none"))

      .attr("d", (d) => arc(d.current));

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .text(`Movies`)
      .style("font-size", "3.2em")
      .style("fill", "#A9BF51");
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

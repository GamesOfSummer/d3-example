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
    const height = 350,
      width = 960;
    const tau = 2 * Math.PI;
    const maxValue = 100;
    const slice = 80;

    const innerRadius = 90,
      outerRadius = 120,
      startAngle = 0,
      cornerRadius = 40;

    d3.select("svg").remove();

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("height", "60%")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const root = d3
      .hierarchy(sunburstData)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    console.log("testing debug output");
    console.log(root);

    // An arc will be created
    const arcGen = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .cornerRadius(cornerRadius);

    const arc1 = svg
      .append("path")
      .datum({ endAngle: tau })
      .style("fill", "#ddd")
      .attr("d", arcGen);

    const foreground = svg
      .append("path")
      .datum({ endAngle: slice * tau })
      .attr("fill", "#F57B21")
      .attr("d", arcGen);

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

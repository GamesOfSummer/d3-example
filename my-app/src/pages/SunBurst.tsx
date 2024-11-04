import React, { useEffect, useRef, useState } from "react";

import * as d3 from "d3";
import LinePlot from "./LinePlot";

export default function SunBurst() {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  return <div></div>;
}

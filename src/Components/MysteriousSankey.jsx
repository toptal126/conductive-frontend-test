import React from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

const SankeyNode = ({ name, x0, x1, y0, y1, color }) => (
  <>
    <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={color}>
      <title>{name}</title>
    </rect>{" "}
    <text x={x0 + 20} y={(y0 + y1) / 2} fill={"black"}>
      {name}
    </text>
  </>
);

const SankeyLink = ({ link, color }) => (
  <path
    d={sankeyLinkHorizontal()(link)}
    style={{
      fill: "none",
      strokeOpacity: ".3",
      stroke: color,
      strokeWidth: Math.max(1, link.width),
    }}
  >
    <title>
      {link.title} {link.value}
    </title>
  </path>
);

const MysteriousSankey = ({ data, width, height }) => {
  const { nodes, links } = sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 1],
      [width - 1, height - 5],
    ])(data);
  return (
    <g style={{ mixBlendMode: "multiply" }}>
      {nodes.map((node, i) => (
        <SankeyNode {...node} key={node.name} color={node.color} />
      ))}
      {links.map((link, i) => (
        <SankeyLink link={link} key={i} color={"black"} />
      ))}
    </g>
  );
};

export default MysteriousSankey;

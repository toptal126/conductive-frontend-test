import React, { useState, useEffect, useRef } from "react";

import * as d3 from "d3";

import "./App.css";

import MysteriousSankey from "./Components/MysteriousSankey";
import CSV from "./raw/quidd-bsc-transfers.csv";

const MINTER = "0x72571d815dd31fbde52be0b9d7ffc8344aede616";
const POLKASTARTER = "0xee62650fa45ac0deb1b24ec19f983a8f85b727ab";
const PANCAKESWAP = "0xd6d206f59cc5a3bfa4cc10bc8ba140ac37ad1c89";
const ZERO = "0x0000000000000000000000000000000000000000";

function App() {
  const [data, setData] = useState(null);

  const svgRef = useRef(null);

  const toFloat = (_data) => {
    return parseFloat(_data.replaceAll(",", "").replaceAll(" ", ""));
  };
  const findCase = (item) => {
    if (item.From === MINTER && item.To === PANCAKESWAP) return 0;
    if (
      item.From === POLKASTARTER &&
      item.To !== PANCAKESWAP &&
      item.To !== ZERO
    )
      return 1;
    if (
      item.From !== ZERO &&
      item.From !== MINTER &&
      item.From !== POLKASTARTER &&
      item.To === PANCAKESWAP
    )
      return 3;
    if (
      item.From !== ZERO &&
      item.From !== MINTER &&
      item.From !== POLKASTARTER &&
      item.To !== ZERO &&
      item.To !== MINTER &&
      item.To !== POLKASTARTER
    )
      return 5;
  };
  useEffect(() => {
    let _mintTotal = 0;
    let _data = {
      links: [
        { source: 0, target: 1, value: 0 },
        { source: 0, target: 2, value: 0 },
        { source: 0, target: 3, value: 0 },
        { source: 2, target: 1, value: 0 },
        { source: 2, target: 3, value: 0 },
        { source: 2, target: 4, value: 0 },
      ],
      nodes: [
        {
          name: "Polkastarter",
          color: "blue",
        },
        {
          name: "PancakeSwap",
          color: "red",
        },
        {
          name: "SecondWallet",
          color: "yellow",
        },
        {
          name: "Hold",
          color: "green",
        },
        {
          name: "ThirdWallet",
          color: "purple",
        },
      ],
    };
    _data.links.forEach((item, index) => {
      _data.links[index].title = `${
        _data.nodes[_data.links[index].source].name
      } -> ${_data.nodes[_data.links[index].target].name}`;
    });
    d3.csv(CSV).then(function (data) {
      data.forEach((item) => {
        findCase(item);
        // console.log(item.From);
        if (item.Method === "Fund") _mintTotal = toFloat(item.Quantity);
        if (findCase(item) === 0) {
          _data.links[0].value += toFloat(item.Quantity);
        }
        if (findCase(item) === 1) {
          _data.links[1].value += toFloat(item.Quantity);
        }
        if (findCase(item) === 3)
          _data.links[3].value += toFloat(item.Quantity);
        if (findCase(item) === 5)
          _data.links[5].value += toFloat(item.Quantity);
      });
      _data.links[2].value =
        _mintTotal - _data.links[0].value - _data.links[1].value;
      _data.links[4].value = _data.links[1].value - _data.links[3].value;
      setData(_data);
    });
  }, []);

  return (
    <div className="App">
      <svg width="100%" height="600" ref={svgRef}>
        {data && <MysteriousSankey data={data} width={500} height={600} />}
      </svg>
    </div>
  );
}

export default App;

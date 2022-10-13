import React, { useState } from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";

import MapChart from "./MapChart";

function MapWithTooltip(props) {
  const [activeTooltip, setActiveTooltip] = useState('');
  return (
    <div>
      <MapChart setActiveCounty={props.setActiveCounty} activeCounty={props.activeCounty} setActiveTooltip={setActiveTooltip} handleCountyChange={props.handleCountyChange}/>
      <ReactTooltip>{activeTooltip}</ReactTooltip>
    </div>
  );
}

export default MapWithTooltip;
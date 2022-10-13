import React, { useState, useEffect, memo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { csv } from "d3-fetch";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const Map = (props) => {
  const [data, setData] = useState([]);
  const [color, setColor] = useState("#ECEFF1");

  useEffect(() => {
    // https://www.bls.gov/lau/
    csv("/unemployment-by-county-2017.csv").then(counties => {
      setData(counties);
    });
  }, []);

  const colorScale = scaleQuantile()
    .domain(data.map(d => d.unemployment_rate))
    .range([
      "#ffedea",
      "#ffcec5",
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618"
    ]);

  return (
    <div data-tip="">
      <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isClicked = props.activeCounty.id === geo.id;
                  return ( 
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    props.setActiveTooltip(`${geo.properties.name}`);
                  }}
                  onMouseLeave={() => {
                    props.setActiveTooltip("");
                  }}
                  onClick={() => {
                    console.log(geo.id)
                    props.setActiveCounty({"name": geo.properties.name, "id": geo.id});
                    props.handleCountyChange(geo.id);
                    setColor("#3482f6")
                  }}
                  fill={isClicked ? "blue" : "#ECEFF1"}
                  stroke="#607D8B"
                  strokeWidth="0.75"
                  outline="none"
                  style={{
                    default: {
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                       fill: "#3b82f6",
                       stroke: "#607D8B",
                       strokeWidth: 1,
                       outline: "none",
                    },
                    pressed: {
                       fill: "#3482f6",
                       stroke: "#607D8B",
                       strokeWidth: 1,
                       outline: "none",
                    }
                 }}
                />
                  )
                }
              )
            }
          </Geographies>
      </ComposableMap>
    </div>
  );
};

export default memo(Map);

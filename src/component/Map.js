import React, { useContext, useRef, useState } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import "./map.css";

// mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function Map() {
  const mapRef = useRef();
  const [leftDisplay, setLeftDisplay] = useState(false);
  const [rightDisplay, setRightDisplay] = useState(false);
  const REACT_APP_MAPBOX_TOKEN =
    "pk.eyJ1IjoiZ3VuZXJpYm9pIiwiYSI6ImNrMnM0NjJ1dzB3cHAzbXVpaXhrdGd1YjIifQ.1TmNd7MjX3AhHdXprT4Wjg";
  const [viewpoint, setViewpoint] = useState({
    latitude: -27.477173,
    longitude: 138.014308,
    width: "100vw",
    height: "100vh",
    zoom: 3.7,
  });
  function toggleSidebar() {}
  return (
    <div className="body">
      <div id="map">
        <ReactMapGl
          ref={mapRef}
          {...viewpoint}
          mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
          onViewportChange={viewpoint => {
            setViewpoint(viewpoint);
          }}
          mapStyle="mapbox://styles/guneriboi/ckliz10u80f7817mtlpnik90t"
          onClick={e => {
            const features = mapRef.current.queryRenderedFeatures(e.point, {
              layers: ["vs-info"],
            });
            var feature = features[0];
            feature && console.log(feature.properties.VideoName);
          }}
        >
          <div id="logo">
            <img
              src="https://vs360maiwar.s3-ap-southeast-2.amazonaws.com/img/logo.svg"
              alt="LOGO"
            />
            <h1>VIRTUAL SONGLINES</h1>
          </div>
          <div id="left" class="sidebar flex-center left collapsed">
            <div class="sidebar-content rounded-rect flex-center">
              <div id="listings" class="listings"></div>

              <div
                class="sidebar-toggle rounded-rect left"
                onclick="toggleSidebar('left')"
              >
                <p>Projects</p>
              </div>
            </div>
          </div>

          <div id="right" class="sidebar flex-center right collapsed">
            <div class="sidebar-content rounded-rect flex-center">
              <div>
                <pre id="features"></pre>
              </div>
            </div>
          </div>
        </ReactMapGl>
      </div>
    </div>
  );
}

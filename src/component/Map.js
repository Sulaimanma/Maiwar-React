import React, { useContext, useRef, useState } from "react";
import ReactMapGl, { Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import "./map.css";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from "./layer";
import PopInfo from "./PopInfo";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function Map() {
  const mapRef = useRef();
  const [leftDisplay, setLeftDisplay] = useState(false);
  const [rightDisplay, setRightDisplay] = useState(false);
  const [popup, setPopup] = useState(false);
  const [feature_point, setFeature] = useState();
  const REACT_APP_MAPBOX_TOKEN =
    "pk.eyJ1IjoiZ3VuZXJpYm9pIiwiYSI6ImNrMnM0NjJ1dzB3cHAzbXVpaXhrdGd1YjIifQ.1TmNd7MjX3AhHdXprT4Wjg";
  const [viewpoint, setViewpoint] = useState({
    latitude: -27.477173,
    longitude: 138.014308,
    width: "100vw",
    height: "100vh",
    zoom: 4.5,
    bearing: 0,
    pitch: 0,
  });
  const onClickFun = e => {
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ["vs-info"],
    });
    setPopup(true);
    console.log(features);
    const feature = features[0];
    const clusterId = feature.properties.uuid;
    setFeature(feature);
    feature && console.log(feature.properties);
    const mapboxSource = mapRef.current.getMap().getSource("earthquakes");

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      setViewpoint({
        ...viewpoint,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500,
      });
    });
  };
  const video = VideoName => {
    var path =
      "https://vs360maiwar.s3-ap-southeast-2.amazonaws.com/video/" +
      VideoName +
      ".mp4";
    return path;
  };
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
          onClick={onClickFun}
        >
          <div id="logo">
            <img
              src="https://vs360maiwar.s3-ap-southeast-2.amazonaws.com/img/logo.svg"
              alt="LOGO"
            />
            <h1>VIRTUAL SONGLINES</h1>
          </div>
          <Source
            id="earthquakes"
            type="geojson"
            data="https://amplifylanguageappgidarjil114226-dev.s3-ap-southeast-2.amazonaws.com/public/wordlist/features.geojson"
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
          {popup && feature_point && (
            <Popup
              latitude={feature_point.geometry.coordinates[1]}
              longitude={feature_point.geometry.coordinates[0]}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setPopup(false)}
              anchor="bottom"
            >
              <PopInfo src={video(feature_point.properties.VideoName)} />
            </Popup>
          )}
        </ReactMapGl>
      </div>
    </div>
  );
}

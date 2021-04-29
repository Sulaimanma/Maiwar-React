import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  // popup control variable
  const [popup, setPopup] = useState(false);
  // mapbox Token
  const REACT_APP_MAPBOX_TOKEN =
    "pk.eyJ1IjoiZ3VuZXJpYm9pIiwiYSI6ImNrMnM0NjJ1dzB3cHAzbXVpaXhrdGd1YjIifQ.1TmNd7MjX3AhHdXprT4Wjg";
  //Initial Viewpoint
  const [viewpoint, setViewpoint] = useState({
    latitude: -27.477173,
    longitude: 138.014308,
    width: "100vw",
    height: "100vh",
    zoom: 4.5,
    bearing: 0,
    pitch: 30,
  });
  //Fetched data
  const [allData, setAllData] = useState(null);
  //Data for display
  const [clickInfo, setclickInfo] = useState(null);
  // Fetch the Layer GeoJson data for display
  useEffect(() => {
    /* global fetch */
    fetch(
      "https://amplifylanguageappgidarjil114226-dev.s3-ap-southeast-2.amazonaws.com/public/wordlist/features.geojson"
    )
      .then(res => res.json())
      .then(json => setAllData(json));
  }, []);

  const onClick = useCallback(event => {
    // Destructure features from the click event data
    const { features } = event;
    // Make sure feature data is not undefined
    const clickedFeature = features && features[0];
    //Control the state of pop up
    setPopup(true);
    //Set the data to display
    setclickInfo(clickedFeature);
  }, []);

  //Video function to play the video according to the Video Name
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
          mapStyle="mapbox://styles/guneriboi/cko26dcwb028v17qgn1swhijn"
          //Define the interactive layer
          interactiveLayerIds={["unclustered-point"]}
          onClick={onClick}
        >
          <div id="logo">
            <img
              src="https://vs360maiwar.s3-ap-southeast-2.amazonaws.com/img/logo.svg"
              alt="LOGO"
            />
            <h1>VIRTUAL SONGLINES</h1>
          </div>
          {/* Load the Layer source data*/}
          <Source
            // id="heritages"
            type="geojson"
            data={allData}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
          {console.log("clickInfo", clickInfo)}

          {/* popup module */}
          {popup && clickInfo != null && clickInfo.properties.VideoName && (
            <Popup
              latitude={clickInfo.geometry.coordinates[1]}
              longitude={clickInfo.geometry.coordinates[0]}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setPopup(false)}
              anchor="bottom"
            >
              <PopInfo src={video(clickInfo.properties.VideoName)} />
            </Popup>
          )}
        </ReactMapGl>
      </div>
    </div>
  );
}

// const onClickFun = e => {
//   const features = mapRef.current.queryRenderedFeatures(e.point, {});
//   setPopup(true);
//   console.log("ffffffffffffffffffffff", features);
//   const feature = features[0];
//   const clusterId = feature.properties.uuid;
//   setFeature(feature);
//   feature && console.log(feature.properties);
//   const mapboxSource = mapRef.current.getMap().getSource("heritages");

//   mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
//     if (err) {
//       return;
//     }

//     setViewpoint({
//       ...viewpoint,
//       longitude: feature.geometry.coordinates[0],
//       latitude: feature.geometry.coordinates[1],
//       zoom,
//       transitionDuration: 500,
//     });
//   });
// };

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
import Pins from "./Pins";
import Sidebar from "./Sidebar/Sidebar";
import DragPin from "./DragPin";

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
    pitch: 0,
  });
  const templete = {
    AudioName: {
      S: "String!",
    },
    createdAt: {
      S: "2021-05-04T05:24:50.327Z",
    },
    description: {
      S: "tetetest",
    },
    Icon: {
      S: "testing",
    },
    id: {
      S: "1",
    },
    latitude: {
      S: "String!",
    },
    longitude: {
      S: "String!",
    },
    SceneToLoad: {
      S: "String!",
    },
    title: {
      S: "test1",
    },
    updatedAt: {
      S: "2021-05-04T05:24:50.327Z",
    },
    user: {
      S: "String!",
    },
    uuid: {
      S: "1",
    },
    VideoName: {
      S: "String!",
    },
  };
  //Fetched data
  const [allData, setAllData] = useState(null);
  //Coverted the data into Dynamo Json
  //Fetch resource to detect whether it is valid or not
  const [resource, setResource] = useState(null);
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
  //covert the json to Dynamo Json
  const Converte = async data => {
    try {
      const path = data.properties;
      const DynamoData = await data.map((heritage, id) => ({
        AudioName: {
          S: path.AudioName,
        },
        createdAt: {
          S: "2021-05-04T05:24:50.327Z",
        },
        description: {
          S: path.description,
        },
        Icon: {
          S: path.Icon,
        },
        id: {
          S: path.uuid,
        },
        latitude: {
          S: data.geometry.coordinates[1],
        },
        longitude: {
          S: data.geometry.coordinates[0],
        },
        SceneToLoad: {
          S: path.SceneToLoad,
        },
        title: {
          S: path.title,
        },
        updatedAt: {
          S: "2021-05-04T05:24:50.327Z",
        },
        user: {
          S: "Admin",
        },
        uuid: {
          S: path.uuid,
        },
        VideoName: {
          S: path.VideoName,
        },
      }));
      console.log("Dynamoooooo", DynamoData);
    } catch (error) {
      console.log("error on fetching heritages", error);
    }
  };

  allData && allData != null && Converte(allData.features);
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
    if (VideoName === "Ducks" || VideoName === "Gathering Bush") {
      var path =
        "https://vs360maiwar.s3-ap-southeast-2.amazonaws.com/video/Camp_Bush_Children_Running.mp4";
    } else {
      var path =
        "https://vs360maiwar.s3-ap-southeast-2.amazonaws.com/video/" +
        VideoName +
        ".mp4";
    }
    // Make sure each Url is valid

    return path;
  };

  //Initial the marker position
  const [marker, setMarker] = useState({
    latitude: -27.477173,
    longitude: 138.014308,
  });
  //Initial the events
  const [events, logEvents] = useState({});
  const onMarkerDragStart = useCallback(event => {
    logEvents(_events => ({ ..._events, onDragStart: event.lngLat }));
  }, []);
  // Detect the drag event
  const onMarkerDrag = useCallback(event => {
    logEvents(_events => ({ ..._events, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd = useCallback(event => {
    logEvents(_events => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);
  // locate the user location label on the map
  const locateUser = () => {
    navigator.geolocation.getCurrentPosition(position => {
      setMarker({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      });
      setViewpoint({
        ...viewpoint,
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      });
    });
  };

  return (
    <div className="body" id="body">
      <Sidebar
        pageWrapId={"map"}
        outerContainerId={"body"}
        locateUser={locateUser}
      />
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

          {allData != null && <Pins data={allData} onClick={onClick} />}
          {/* Locate the user marker label */}
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            offsetTop={-20}
            offsetLeft={-10}
            draggable
            onDragStart={onMarkerDragStart}
            onDrag={onMarkerDrag}
            onDragEnd={onMarkerDragEnd}
          >
            <DragPin size={20} />
          </Marker>

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
              <PopInfo
                src={video(clickInfo.properties.VideoName)}
                description={clickInfo.properties.description}
                title={clickInfo.properties.title}
              />
            </Popup>
          )}
        </ReactMapGl>
      </div>
    </div>
  );
}

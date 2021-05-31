import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import ReactMapGl, {
  Marker,
  Popup,
  Source,
  Layer,
  FlyToInterpolator,
} from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import "./map.css"
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
  mapRasterLayer,
} from "./layer"

import PopInfo from "./PopInfo"
// import Pins from "./Pins"
import Sidebar from "./Sidebar/Sidebar"
import DragPin from "./DragPin"
import API, { graphqlOperation } from "@aws-amplify/api"
import { createHeritages } from "../graphql/mutations"
import { v4 as uuid } from "uuid"
import { HeritageContext } from "./Helpers/Context"
import HeritageInput from "./HeritageInput"
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css"
import { Client as Styletron } from "styletron-engine-atomic"
import { Provider as StyletronProvider } from "styletron-react"
import { LightTheme, BaseProvider, styled } from "baseui"
import { Tabs, Tab, ORIENTATION, FILL } from "baseui/tabs-motion"
import Geocoder from "react-map-gl-geocoder"
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"
import Storage from "@aws-amplify/storage"

mapboxgl.workerClass = MapboxWorker
const engine = new Styletron()
const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
})

export default function Map() {
  const mapRef = useRef()
  // popup control variable
  const { heritages, fetchHeritages } = useContext(HeritageContext)
  //set up a enterfield
  const [enter, setEnter] = useState(false)

  const [popup, setPopup] = useState(false)
  // mapbox Token
  const REACT_APP_MAPBOX_TOKEN =
    "pk.eyJ1IjoiZ3VuZXJpYm9pIiwiYSI6ImNrMnM0NjJ1dzB3cHAzbXVpaXhrdGd1YjIifQ.1TmNd7MjX3AhHdXprT4Wjg"
  //Initial Viewpoint
  const [viewpoint, setViewpoint] = useState({
    latitude: -27.477173,
    longitude: 138.014308,
    width: "100vw",
    height: "100vh",
    zoom: 4.5,
    bearing: 0,
    pitch: 0,
  })

  // Fetched data
  const [allData, setAllData] = useState(null)

  //Data for display
  const [clickInfo, setclickInfo] = useState(null)

  //Set up the Urls
  const [videoUrl, setVideoUrl] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  //Tabs Control
  const [activeKey, setActiveKey] = useState("0")
  //Spinner state control
  const [loading, setLoading] = useState(false)
  //Display  different historic map
  const [historicMap, setHistoricMap] = useState({ url: "", coordinates: [] })
  //Map1798

  const map1798 = {
    url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/GreaterMeeanjinMap1798.jpg",
    coordinates: [
      [152.962180055, -27.362875842],
      [153.114333621, -27.362876876],
      [153.114334004, -27.579233505],
      [152.962180049, -27.579232338],
    ],
  }
  //Map1858

  const map1858 = {
    url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/cad-map-brisbane-1858.jpg",
    coordinates: [
      [153.009207, -27.442971],
      [153.055312, -27.448955],
      [153.045831, -27.505405],
      [152.999768, -27.499457],
    ],
  }
  // Fetch the Layer GeoJson data for display
  // useEffect(() => {
  //   /* global fetch */
  //   fetch(
  //     "https://amplifylanguageappgidarjil114226-dev.s3-ap-southeast-2.amazonaws.com/public/wordlist/features.geojson"
  //   )
  //     .then((res) => res.json())
  //     .then((json) => setAllData(json))
  // }, [])

  const onClick = useCallback((event) => {
    // Destructure features from the click event data
    const { features } = event
    // Make sure feature data is not undefined
    const clickedFeature = features && features[0]
    //Control the state of pop up
    setPopup(true)
    //Set the data to display
    setclickInfo(clickedFeature)

    var featuresss = mapRef.current.queryRenderedFeatures(event.point)
  }, [])

  //Video function to play the video according to the Video Name
  const video = async (VideoName) => {
    try {
      console.log("videoURL FOR REAL", VideoName)
      if (VideoName.length != 0) {
        var path = await Storage.get(`${VideoName}`, {
          level: "public",
        })
      } else {
        var path =
          "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/video/" +
          "Camp_Bush_Children_Running.mp4"
      }
      // Make sure each Url is valid
    } catch (error) {
      console.log("error happens on getting videos", error)
    }

    return path
  }

  //Initial the marker position
  const [marker, setMarker] = useState({
    latitude: -27.477173,
    longitude: 138.014308,
  })
  //Initial the events
  const [events, logEvents] = useState({})

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }))
  }, [])
  // Detect the drag event
  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }))
  }, [])

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }))
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    })
  }, [])
  // locate the user location label on the map
  const locateUser = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMarker({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      })

      setViewpoint({
        ...viewpoint,
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        zoom: 15,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.7 }),
        transitionDuration: "auto",
      })
    })
  }

  // Add the lcal DynamoDB data to the database
  //covert the json to Dynamo Json
  // const Converte = async (data) => {
  //   try {
  //     const DynamoData = await data.map((heritage, id) => ({
  //       AudioName: heritage.properties.AudioName,
  //       description: heritage.properties.description,
  //       Icon: heritage.properties.Icon,
  //       id: uuid(),
  //       latitude: `${heritage.geometry.coordinates[1]}`,
  //       longitude: `${heritage.geometry.coordinates[0]}`,
  //       SceneToLoad: heritage.properties.SceneToLoad,
  //       title: heritage.properties.title,
  //       user: "Admin",
  //       uuid: 2,
  //       VideoName: heritage.properties.VideoName,
  //       ImageName: "",
  //     }))

  //     loadLocalData(DynamoData)
  //   } catch (error) {
  //     console.log("error on fetching heritages", error)
  //   }
  // }

  //Mapping the data into each heritage
  // const loadLocalData = (data) => {
  //   data.map((heritage, id) => dataCreate(heritage))
  // }

  //Create the heritage into the database
  // const dataCreate = async (heritage) => {
  //   try {
  //     await API.graphql(graphqlOperation(createHeritages, { input: heritage }))
  //   } catch (error) {
  //     console.log("error happened during load local data to dynamoDB", error)
  //   }
  // }

  // add the local json to the database
  // useEffect(() => {
  //   console.log(allData)
  // allData != null && Converte(allData.features)
  // }, [])

  // Covert to Geojson
  console.log("before converted to geojson", heritages[0])
  const covertGeojson = (data) => {
    if (data && data.length != 0) {
      const heritagesArray = data.map((heritage, id) => ({
        type: "Feature",
        properties: {
          InspectionCarriedOut: heritage.InspectionCarriedOut,
          // accessRouteCoordinate: '[{"routeCoordinate":"route1"}]',
          // additionalComments: "",
          // clearedToProceed: false,
          // coordinator:
          //   '[{"coordinatorName":"Faiz","coordinatorSignature":{"key":"img/45fcb222-3c9d-424b-90ab-fac8a2f4289fscreen2.PNG"}}]',
          // createdAt: "2021-05-26T08:45:43.850Z",
          // examinedRouteLocation: "",
          // heritageFieldOfficer:
          //   '[{"officerName":"sulaiman","officerSignature":"img/6c7e2235-0647-4371-9428-3463283201e1mycommunitydirectoryPNG.PNG"},{"officerName":"Ryan","officerSignature":"img/c3571136-6ba8-4f81-80d3-a80983486859screen2.PNG"}]',
          // id: "cf5f326a-d297-4064-801d-f642151ac0c4",
          // identifiedOrNot: false,
          // inspectionPerson: "Sulaiman",
          photo: heritage.photo,
          photoDescription: heritage.photoDescription,
          // routeExaminedOrNot: false,
          siteIssue: heritage.siteIssue,
          // siteNumber: "dsfdsfdssdfds",
          surveyDate: heritage.surveyDate,
          // technicalAdvisor:
          //   '[{"advisorSignature":{"key":"img/c7680429-9ed8-4fb1-8c3e-5515f2daed2ascreen3.PNG"},"advisorName":"Angela"}]',
          // updatedAt: "2021-05-26T08:45:43.850Z",
          video: heritage.video,
          videoDescription: heritage.videoDescription,
          visibility: heritage.visibility,
        },
        geometry: {
          coordinates: [
            parseFloat(JSON.parse(heritage.GPSCoordinates)[0].easting),
            parseFloat(JSON.parse(heritage.GPSCoordinates)[0].northing),
          ],
          type: "Point",
        },
        id: heritage.id,
      }))
      const finalGeo = {
        features: heritagesArray,
        type: "FeatureCollection",
      }

      return finalGeo
    }
  }

  const geojson = useMemo(() => {
    if (heritages && heritages.length != 0) {
      var final = covertGeojson(heritages)
    }
    return final
  }, [heritages])
  var geoConvertedjson = null
  geojson && (geoConvertedjson = geojson)
  console.log(geojson)
  const handleViewportChange = useCallback((viewpoint) => {
    setViewpoint(viewpoint)
  }, [])

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      console.log("New viewpoint", newViewport)
      setMarker({
        longitude: newViewport.longitude,
        latitude: newViewport.latitude,
      })

      setViewpoint({
        ...viewpoint,
        longitude: newViewport.longitude,
        latitude: newViewport.latitude,
        zoom: 15,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.7 }),
        transitionDuration: "auto",
      })
    },
    [handleViewportChange]
  )
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
          onViewportChange={handleViewportChange}
          mapStyle="mapbox://styles/guneriboi/ckp69hfy90ibu18pimha653fd"
          //Define the interactive layer
          interactiveLayerIds={[unclusteredPointLayer.id]}
          onClick={onClick}
          width="100%"
          height="100%"
        >
          <div className="tabs">
            <StyletronProvider value={engine}>
              <BaseProvider theme={LightTheme}>
                <Centered>
                  <Tabs
                    activeKey={activeKey}
                    onChange={({ activeKey }) => setActiveKey(activeKey)}
                    orientation={ORIENTATION.vertical}
                    activateOnFocus
                    fill={FILL.fixed}
                  >
                    <Tab
                      title="Brisbane 1798"
                      onClick={() => {
                        setHistoricMap({
                          url: map1798.url,
                          coordinates: map1798.coordinates,
                        })
                        setViewpoint({
                          ...viewpoint,
                          longitude: 153.03807,
                          latitude: -27.4710546,
                          zoom: 11.5,
                          transitionInterpolator: new FlyToInterpolator({
                            speed: 1.7,
                          }),
                          transitionDuration: "auto",
                        })
                      }}
                    ></Tab>
                    <Tab
                      title="Brisbane 1858"
                      onClick={() => {
                        setHistoricMap({
                          url: map1858.url,
                          coordinates: map1858.coordinates,
                        })
                        setViewpoint({
                          ...viewpoint,
                          longitude: 153.02754,
                          latitude: -27.4741875,
                          zoom: 13,
                          transitionInterpolator: new FlyToInterpolator({
                            speed: 1.7,
                          }),
                          transitionDuration: "auto",
                        })
                      }}
                    ></Tab>
                    {console.log(historicMap)}
                  </Tabs>
                </Centered>
              </BaseProvider>
            </StyletronProvider>
          </div>
          <Geocoder
            mapRef={mapRef}
            marker={false}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
            position="top-right"
          />
          <div id="logo">
            <img
              src="https://vs360maiwar.s3-ap-southeast-2.amazonaws.com/img/logo.svg"
              alt="LOGO"
            />
            <h1>VIRTUAL SONGLINES</h1>
          </div>

          {/* Load the Layer source data*/}
          {console.log("geoConvertedjson", geoConvertedjson)}
          {geoConvertedjson != null && (
            <Source
              // id="heritages"
              type="geojson"
              data={geoConvertedjson}
              cluster={true}
              clusterMaxZoom={14}
              clusterRadius={50}
            >
              <Layer {...clusterLayer} />
              <Layer {...clusterCountLayer} />
              <Layer {...unclusteredPointLayer} />
            </Source>
          )}
          <Source
            // maxzoom={22}
            // minzoom={9}
            id="mapRaster"
            type="image"
            url={historicMap.url}
            coordinates={historicMap.coordinates}
          >
            <Layer {...mapRasterLayer}></Layer>
          </Source>

          {/* {geoConvertedjson != null && (
            <Pins data={geoConvertedjson} onClick={onClick} />
          )} */}
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
            <DragPin
              size={20}
              clickFunction={() => {
                setEnter(true)
              }}
            />
          </Marker>
          {enter && (
            <Popup
              latitude={marker.latitude}
              longitude={marker.longitude}
              closeButton={!loading}
              closeOnClick={false}
              onClose={() => setEnter(false)}
              anchor="right"
              color="black"
              captureScroll={true}
              dynamicPosition={false}
              captureScroll={true}
              captureDrag={false}
            >
              <HeritageInput
                longitude={marker.longitude}
                latitude={marker.latitude}
                fetchHeritages={fetchHeritages}
                setEnter={setEnter}
                loading={loading}
                setLoading={setLoading}
              />
            </Popup>
          )}
          {popup && clickInfo != null && (
            <Popup
              latitude={clickInfo.geometry.coordinates[1]}
              longitude={clickInfo.geometry.coordinates[0]}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setPopup(false)}
              anchor="bottom"
              dynamicPosition={true}
              captureScroll={true}
              captureDrag={false}
            >
              {console.log(
                "VideoURLLLLLLLLLLLLLLLLLL",
                video(clickInfo.properties.video).then((result) => {
                  setVideoUrl(result)
                })
              )}

              <PopInfo
                src={videoUrl}
                description={clickInfo.properties.visibility}
                title={clickInfo.properties.InspectionCarriedOut}
              />
            </Popup>
          )}
        </ReactMapGl>
      </div>
    </div>
  )
}

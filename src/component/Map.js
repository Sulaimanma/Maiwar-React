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
  NavigationControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import "./map.css"
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
  mapRasterLayer,
  PCCCIconsLayer,
  ThreeDBuildingLayer,
} from "./layer"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
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
// import { Provider as StyletronProvider } from "styletron-react"
// import { LightTheme, BaseProvider, styled } from "baseui"
// import { Tabs, Tab, ORIENTATION, FILL } from "baseui/tabs-motion"
// import { Checkbox, STYLE_TYPE } from "baseui/checkbox"
import Geocoder from "react-map-gl-geocoder"
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"
import Storage from "@aws-amplify/storage"
import HistoricMap from "./HistoricMap"
import { withStyles } from "@material-ui/core/styles"
import axios from "axios"
import BearSlider from "./BearSlider"
import isMobile from "./isMobile"
import {
  Deck,
  _GlobeView as GlobeView,
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight,
} from "@deck.gl/core"
import ReactPlayer from "react-player"
import { SolidPolygonLayer, GeoJsonLayer, ArcLayer } from "@deck.gl/layers"
import { DeckGL } from "deck.gl"

mapboxgl.workerClass = MapboxWorker
const engine = new Styletron()

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson" //eslint-disable-line

export default function Map() {
  const mapRef = useRef()
  const videoRef = useRef()
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
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 1,
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

  //Spinner state control
  const [loading, setLoading] = useState(false)
  //Display  different historic map

  //Toggle button of 3d map
  const [checkboxes, setCheckboxes] = useState([false, false])
  //Toggle 3d building
  const [building, setBuilding] = useState([true, false])
  //Toggle layer
  const [mapLayer, setMapLayer] = useState([true, false])
  //historic map initial value
  const [historicMap, setHistoricMap] = useState({
    url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Brisbane 1798.jpg",
    coordinates: [
      [152.962180055, -27.395],
      [153.114333621, -27.395],
      [153.114334004, -27.547],
      [152.962180049, -27.547],
    ],
    longitude: 152.962180049,
    latitude: -27.547,
    zoom: 11.8,
    pitch: 60,
    bearing: 20,
  })
  //fetched data
  const [PCCC, setPCCC] = useState()
  const skyLayer = {
    id: "sky",
    type: "sky",
    paint: {
      "sky-type": "atmosphere",
      "sky-atmosphere-sun": [0.0, 0.0],
      "sky-atmosphere-sun-intensity": 15,
    },
  }
  //Globe view properties
  const [display, setDisplay] = useState("flex")
  const [nondisplay, setNondisplay] = useState("none")

  // Fetch the Layer GeoJson data for display
  // useEffect(() => {
  //   /* global fetch */
  //   fetch(
  //     "https://amplifylanguageappgidarjil114226-dev.s3-ap-southeast-2.amazonaws.com/public/wordlist/features.geojson"
  //   )
  //     .then((res) => res.json())
  //     .then((json) => setAllData(json))
  // }, [])

  //3D viewpoint
  useEffect(async () => {
    checkboxes[0]
      ? await setViewpoint({
          ...viewpoint,
          pitch: 75,
          bearing: 0,
          transitionInterpolator: new FlyToInterpolator({ speed: 1.7 }),
          transitionDuration: "auto",
        })
      : await setViewpoint({
          ...viewpoint,
          pitch: 0,
          bearing: 0,
          transitionInterpolator: new FlyToInterpolator({ speed: 1.7 }),
          transitionDuration: "auto",
        })
  }, [checkboxes[0]])
  //3d building

  //Resize window function
  const resize = () => {
    setViewpoint({
      ...viewpoint,
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }
  useEffect(() => {
    window.addEventListener("resize", resize)
    return function cleanUp() {
      window.removeEventListener("resize", resize)
    }
  }, [])
  // Enable the bear control

  const onClick = useCallback(async (event) => {
    // Destructure features from the click event data
    const { features } = await event
    // Make sure feature data is not undefined
    const clickedFeature = (await features) && features[0]
    //Control the state of pop up
    setPopup(true)
    //Set the data to display
    setclickInfo(clickedFeature)

    var featuresss = mapRef.current.queryRenderedFeatures(event.point)
  }, [])

  //Video function to play the video according to the Video Name
  const video = async (VideoName) => {
    try {
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
          heritageType: heritage.heritageType,
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
  //map view change

  // Use i and g to fix the zoom identified accuracy issues
  let i = 1
  let g = 1
  const handleViewportChange = useCallback((view) => {
    // console.log("zoommmmm", view.zoom)
    // console.log("iiiiiiiii", i)
    if (view.zoom <= 5.13) {
      i = i + 1
    }
    if (i >= 6) {
      setNondisplay("none")
      setDisplay("inherit")
      i = 1
    } else if (i === 1) {
      setViewpoint(view)
      setMarker({
        longitude: view.longitude,
        latitude: view.latitude,
      })
    }
  }, [])
  //Globe view change
  const handleViewStateChange = useCallback((view) => {
    // console.log("zoomggggg", view.viewState.zoom)
    // console.log("ggggg", g)
    if (view.viewState.zoom > 6.644) {
      g = g + 1
    }
    if (g >= 16) {
      setDisplay("none")
      setNondisplay("inherit")
      setViewpoint(view.viewState)
      g = 1
    }
    // else if (i === 1) {
    //   setViewpoint(view.viewState)
    // }

    // console.log('viewpoint', viewpoint.viewState);
  }, [])

  //Fly to different project on map
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
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
  //Restyle the switch button
  const GreenSwitch = withStyles({
    switchBase: {
      color: "#6c757d",
      "&$checked": {
        color: "#32c40e",
      },
      "&$checked + $track": {
        backgroundColor: "#32c40e",
      },
    },
    checked: {},
    track: {},
  })(Switch)

  //fetch data with API
  const fetchData = (url) => {
    axios
      .get(url)
      .then((res) => {
        const allData = res.data
        // console.log("Get the data", res.data)
        setPCCC(allData)
      })
      .then(console.log("PCCC", PCCC))
      .catch((error) => console.log(`Error:${error}`))
  }
  useEffect(async () => {
    await fetchData(
      "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/json/VS_Info.geojson"
    )
  }, [])
  // Modify the video speed
  useEffect(() => {
    console.log("videoReference", videoRef.current)
    videoRef.current.playbackRate = 0.7
  }, [])
  useEffect(() => {
    const map = mapRef.current.getMap()

    // map.addSource("mapbox-dem", {
    //   "type": "raster-dem",
    //   "url": "mapbox://mapbox.terrain-rgb",
    //   "tileSize": 512,
    //   "maxzoom": 14,
    // })
    // map.setTerrain({
    //   "source": "mapbox-dem",
    //   "exaggeration": 1.5,
    // })

    const VSInfo = [
      "Burial",
      "Bora",
      "Bushfood",
      "Camp",
      "Crossing",
      "Duck",
      "Fish",
      "Midden",
      "Kangaroo",
      "Medicine",
      "Possums",
      "Turtle",
      "Artefact Scatter",
      "Quarry",
    ]
    VSInfo.map((img, id) => {
      map.loadImage(
        ` https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/img/icons/${img}.png`,
        function (error, image) {
          if (error) throw error

          // Add the image to the map style.
          map.addImage(`${img}`, image)
        }
      )
    })
  }, [mapRef])
  //Enable the rgb terrain
  // const onMapLoad = useCallback((evt) => {
  //   const map = evt.target
  //   map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 })
  // }, [])

  //Globe light effect
  const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 0.5,
  })
  const sunLight = new SunLight({
    color: [255, 255, 255],
    intensity: 2.0,
    timestamp: 0,
  })
  // create lighting effect with light sources
  const lightingEffect = new LightingEffect({ ambientLight, sunLight })

  return (
    <div className="body" id="body">
      {/* <div style={{ width: "100vw", height: "100vh", display: `${display}` }}>
        <img
          width="100%"
          height="100%"
          src="https://images.unsplash.com/photo-1528819027803-5473f2bf7633?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1189&q=80"
        />
      </div> */}
      <Sidebar
        pageWrapId={"map"}
        outerContainerId={"body"}
        locateUser={locateUser}
      />
      {isMobile() && (
        <div className="bearCtrl">
          <BearSlider viewpoint={viewpoint} setViewpoint={setViewpoint} />
        </div>
      )}
      <div
        id="map"
        style={{ display: `${nondisplay}`, width: "100vw", height: "100vh" }}
      >
        <ReactMapGl
          ref={mapRef}
          {...viewpoint}
          mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
          onViewportChange={handleViewportChange}
          // mapStyle="mapbox://styles/mapbox/satellite-streets-v11"

          mapStyle="mapbox://styles/guneriboi/ckliz10u80f7817mtlpnik90t"
          //Define the interactive layer
          // interactiveLayerIds={[unclusteredPointLayer.id]}
          onClick={onClick}
        >
          <GeolocateControl
            style={{
              bottom: "11vh",
              right: "0",
              padding: "0",
            }}
            showUserLocation={true}
            trackUserLocation={false}
            showAccuracyCircle={false}
            onViewportChange={locateUser}
          />
          <ScaleControl
            style={{
              bottom: "0",
              left: "0",
              padding: "2px",
            }}
          />
          <NavigationControl
            showCompass={true}
            style={{ bottom: "2px", right: "0px" }}
          />
          {/* <Source
            id="mapbox-dem"
            type="raster-dem"
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
            maxzoom={14}
          /> */}
          <Geocoder
            mapRef={mapRef}
            marker={false}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
            position="top-right"
            positionOptions={{ enableHighAccuracy: true, timeout: 6000 }}
          />
          <div className="tabs">
            {/* <StyletronProvider value={engine}>
              <BaseProvider theme={LightTheme}> */}
            <HistoricMap
              viewpoint={viewpoint}
              setViewpoint={setViewpoint}
              historicMap={historicMap}
              setHistoricMap={setHistoricMap}
              setMarker={setMarker}
            />
            {/* </BaseProvider>
            </StyletronProvider> */}
          </div>
          {/* <div class="toggleWrapper">
            <input
              type="checkbox"
              name="toggle1"
              class="mobileToggle"
              id="toggle1"
              checked
            ></input>
            <label for="toggle1"></label>
          </div> */}
          <div id="logo">
            <img
              src="https://vs360maiwar.s3-ap-southeast-2.amazonaws.com/img/logo.svg"
              alt="LOGO"
            />
          </div>
          <div className="Toggle3d" style={{ width: "150px" }}>
            <FormControlLabel
              control={
                <GreenSwitch
                  checked={checkboxes[0]}
                  onChange={(e) => {
                    const nextCheckboxes = [...checkboxes]
                    nextCheckboxes[0] = e.currentTarget.checked
                    setCheckboxes(nextCheckboxes)
                  }}
                  name="checkedB"
                  color="secondary"
                  // size="large"
                />
              }
            />
            <div className="Text3d" style={{ left: "2.6vw" }}>
              3D
            </div>
          </div>
          {/* 3d buildings */}
          <div className="Toggle3d2" style={{ width: "150px", right: "7.7vw" }}>
            <FormControlLabel
              control={
                <GreenSwitch
                  checked={building[0]}
                  onChange={(e) => {
                    const nextBuilding = [...building]
                    nextBuilding[0] = e.currentTarget.checked
                    setBuilding(nextBuilding)
                  }}
                  name="checkedB"
                  color="secondary"
                  // size="large"
                />
              }
            />
            <div className="Text3d2" style={{ left: "2vw" }}>
              Buildings
            </div>
          </div>
          {/* layers switch */}
          <div className="Toggle3d3" style={{ width: "150px", right: "9.7vw" }}>
            <FormControlLabel
              control={
                <GreenSwitch
                  checked={mapLayer[0]}
                  onChange={(e) => {
                    const nextMapLayer = [...mapLayer]
                    nextMapLayer[0] = e.currentTarget.checked
                    setMapLayer(nextMapLayer)
                  }}
                  name="checkedB"
                  color="secondary"
                  // size="large"
                />
              }
            />
            <div className="Text3d3" style={{ left: "2vw" }}>
              Layers
            </div>
          </div>
          <Layer {...skyLayer} />
          {building[0] && <Layer {...ThreeDBuildingLayer} />}

          {/* Load the Layer source data*/}
          {geoConvertedjson != null && (
            <Source
              id="heritages"
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
          {/* {console.log("geooooooooooooo", PCCC)} */}
          {PCCC && (
            <Source
              type="geojson"
              data={PCCC}
              id="PCCC"
              cluster={true}
              clusterRadius={50}
            >
              <Layer {...PCCCIconsLayer} />
            </Source>
          )}
          {historicMap.url.length != 0 && mapLayer[0] && (
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
          )}

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
              size={30}
              clickFunction={() => {
                setEnter(true)
              }}
            />
          </Marker>
          {enter && (
            <Popup
              latitude={marker.latitude}
              longitude={marker.longitude}
              closeButton={false}
              closeOnClick={true}
              onClose={() => setEnter(false)}
              anchor="right"
              color="black"
              captureScroll={true}
              dynamicPosition={false}
              captureScroll={true}
              captureDrag={false}
              captureClick={true}
              capturePointerMove={true}
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

          {popup &&
            clickInfo &&
            clickInfo != null &&
            clickInfo.source === "heritages" && (
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
                {clickInfo.source === "heritages" ? (
                  <PopInfo
                    src={videoUrl}
                    description={clickInfo.properties.visibility}
                    title={clickInfo.properties.InspectionCarriedOut}
                  />
                ) : (
                  <PopInfo
                    src={videoUrl}
                    description={clickInfo.properties.description}
                    title={clickInfo.properties.title}
                  />
                )}
              </Popup>
            )}
          {popup &&
            clickInfo &&
            clickInfo != null &&
            clickInfo.source === "PCCC" && (
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
                  video(`video/${clickInfo.properties.VideoName}.mp4`).then(
                    (result) => {
                      setVideoUrl(result)
                    }
                  )
                )}

                {clickInfo.source === "PCCC" &&
                  clickInfo.properties.VideoName != null && (
                    <PopInfo
                      src={videoUrl}
                      description={clickInfo.properties.description}
                      title={clickInfo.properties.title}
                    />
                  )}
              </Popup>
            )}
        </ReactMapGl>
      </div>

      <div className="globe" style={{ display: `${display}` }}>
        <video ref={videoRef} className="videoTag" autoPlay loop muted>
          <source
            src="https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/mapSourceImg/galaxy.mp4"
            type="video/mp4"
          />
        </video>

        <DeckGL
          // {...viewpoint}

          views={
            new GlobeView({
              resolution: 10,

              // longitude: viewpoint.longitude,
              // latitude: viewpoint.latitude
            })
          }
          initialViewState={{
            latitude: -27.477173,
            longitude: 138.014308,
            zoom: 1,
          }}
          controller={true}
          onViewStateChange={handleViewStateChange}
          layers={[
            // A GeoJSON polygon that covers the entire earth
            // See /docs/api-reference/globe-view.md#remarks
            new SolidPolygonLayer({
              id: "background",
              data: [
                // prettier-ignore
                [[-180, 90], [0, 90], [180, 90], [180, -90], [0, -90], [-180, -90]],
              ],
              opacity: 0.5,
              getPolygon: (d) => d,
              stroked: false,
              filled: true,
              // getFillColor: [32, 201, 218],
              getFillColor: [25, 119, 154, 255],
            }),
            new GeoJsonLayer({
              id: "base-map",
              data: COUNTRIES,
              // Styles
              stroked: true,
              filled: true,
              lineWidthMinPixels: 1,
              getLineColor: [95, 159, 140, 255],
              getFillColor: [157, 192, 98, 255],
            }),
            // new GeoJsonLayer({
            //   id: 'airports',
            //   data: AIR_PORTS,
            //   // Styles
            //   filled: true,
            //   pointRadiusMinPixels: 2,
            //   pointRadiusScale: 2000,
            //   getRadius: f => 11 - f.properties.scalerank,
            //   getFillColor: [200, 0, 80, 180],
            //   // Interactive props
            //   pickable: true,
            //   autoHighlight: true,
            //   onClick: info =>
            //     // eslint-disable-next-line
            //     info.object &&
            //     alert(
            //       `${info.object.properties.name} (${
            //         info.object.properties.abbrev
            //       })`
            //     )
            // }),
            // new ArcLayer({
            //   id: 'arcs',
            //   data: AIR_PORTS,
            //   dataTransform: d =>
            //     d.features.filter(f => f.properties.scalerank < 4),
            //   // Styles
            //   getSourcePosition: f => [-0.4531566, 51.4709959], // London
            //   getTargetPosition: f => f.geometry.coordinates,
            //   getSourceColor: [0, 128, 200],
            //   getTargetColor: [200, 0, 80],
            //   getWidth: 1
            // })
          ]}
          effects={[lightingEffect]}
        />
      </div>
    </div>
  )
}

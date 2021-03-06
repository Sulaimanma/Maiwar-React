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
  boundriesLayer,
  regionName,
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
// import ReactPlayer from "react-player"
import { SolidPolygonLayer, GeoJsonLayer, ArcLayer } from "@deck.gl/layers"
import { DeckGL } from "deck.gl"
import Weather from "./Weather"
import { boundtries, regionsText, weatherData } from "./Helpers/DataBank"
import {
  Viewer,
  Entity,
  Camera,
  Scene,
  Globe,
  SkyBox,
  CameraFlyTo,
} from "resium"
import { Cartesian3, createWorldTerrain, Math as CesiumMath } from "cesium"
import Color from "cesium/Source/Core/Color"
import BounceLoader from "react-spinners/BounceLoader"

mapboxgl.workerClass = MapboxWorker
const engine = new Styletron()

const position = Cartesian3.fromDegrees(152.9794409, -27.5084143, 12000000)
const pointGraphics = { pixelSize: 8 }
const terrainProvider = createWorldTerrain()

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/mapSourceImg/GlobeWithBoundries.geojson"
// const COUNTRIES =
//   "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson" //eslint-disable-line

// https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson
// test
export default function Map() {
  const mapRef = useRef()

  const geocoderContainerRef = useRef()
  const videoRef = useRef()
  const earthRef = useRef()
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
    zoom: 1,
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
      if (VideoName === "video/.mp4" || !VideoName) {
        var path =
          "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/video/" +
          "Camp_Bush_Children_Running.mp4"
      } else if (VideoName.length != 0) {
        var path = await Storage.get(`${VideoName}`, {
          level: "public",
        })

        console.log("video path is", path)
      } else if (VideoName === "Gathering Bush.mp4") {
        var path =
          "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/video/" +
          "Camp_Bush_Children_Running.mp4"
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

  //When to run the video function

  useEffect(() => {
    popup &&
      clickInfo &&
      clickInfo != null &&
      clickInfo.source != null &&
      clickInfo.properties &&
      clickInfo.properties.length != 0 &&
      clickInfo.properties.VideoName &&
      clickInfo.properties.VideoName.length !== 0 &&
      video(`video/${clickInfo.properties.VideoName}.mp4`).then((result) => {
        setVideoUrl(result)
        console.log("Videonamiiiiiiiiii")
      })

    popup &&
      clickInfo &&
      clickInfo != null &&
      clickInfo.source != null &&
      clickInfo.properties &&
      clickInfo.properties.length != 0 &&
      clickInfo.properties.video &&
      clickInfo.properties.video.length !== 0 &&
      video(`${clickInfo.properties.video}`).then((result) => {
        setVideoUrl(result)
        console.log("Videoooooooooo")
      })
    console.log("!!!!!!!!click info", clickInfo)
    // ? clickInfo.properties.video.length !== 0 &&
    //   video(`${clickInfo.properties.video}.mp4`).then((result) => {
    //     setVideoUrl(result)
    //   })
    // : clickInfo.properties.VideoName.length !== 0 &&
    //   video(`video/${clickInfo.properties.VideoName}.mp4`).then((result) => {
    //     setVideoUrl(result)
    //   })
  }, [clickInfo, videoUrl])
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
  let preHeight = 10000000000
  let preZoomM = 22
  const InspectCamera = () => {
    const scene = earthRef.current.cesiumElement.scene
    const camera = scene.camera
    console.log("position", camera.positionCartographic)
    const { longitude, latitude, height } = camera.positionCartographic
    let pi = Math.PI

    const longi = longitude * (180 / pi)
    const lati = latitude * (180 / pi)
    if (height < 7001597 && preHeight > height) {
      preHeight = height
      g = g + 1
    }
    if (g > 1) {
      setViewpoint({
        ...viewpoint,
        longitude: longi,
        latitude: lati,
        zoom: height / 1000000,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.7 }),
        transitionDuration: "auto",
      })
      setNondisplay("inherit")
      setDisplay("none")
    }
    // console.log("heading (deg)", CesiumMath.toDegrees(camera.heading))
    // console.log("pitch (deg)", CesiumMath.toDegrees(camera.pitch))
    // console.log("roll (deg)", CesiumMath.toDegrees(camera.roll))
    console.log("coordinate:", longi, lati, height / 1000000)
  }
  const handleChangeView = (e) => {
    console.log("eeeeeeeeeee", e)
    InspectCamera()
  }
  const handleViewportChange = useCallback((view) => {
    // console.log("zoommmmm", view)
    // console.log("iiiiiiiii", i)

    setViewpoint(view)
    console.log(
      "coordinate viewpoint",
      viewpoint.longitude,
      viewpoint.latitude,
      viewpoint.zoom
    )
    console.log(
      "coordinate viewpoint!!!!!!",
      view.longitude,
      view.latitude,
      view.zoom,
      view,
      viewpoint
    )
    if ((view.zoom <= 7.15 && view.zoom < preZoomM) || view.zoom < 2.35) {
      i = i + 1
      preZoomM = view.zoom
      // console.log("iiiiiiiii", i)
    }
    if (i >= 5) {
      preZoomM = 22
      i = 1
      g = 1
      setNondisplay("none")
      setDisplay("unset")
      // if (
      //   earthRef.current.cesiumElement &&
      //   earthRef.current.cesiumElement.length != 0
      // ) {
      //   const scene = earthRef.current.cesiumElement.scene
      //   const camera = scene.camera
      //   let pi = Math.PI

      //   camera.flyTo({
      //     destination: Cartesian3.fromDegrees(
      //       viewpoint.longitude * (180 / pi) - 100000,
      //       viewpoint.latitude * (180 / pi) + 100000,

      //       7201597
      //     ),
      //   })
      // }
    } else {
      setMarker({
        longitude: view.longitude,
        latitude: view.latitude,
      })
    }
  }, [])
  //Globe view change
  // const handleViewStateChange = useCallback((view) => {
  //   // console.log("zoomggggg", view.viewState)
  //   // console.log("pre", preZoomG)

  //   if (view.viewState.zoom > 2.7 && view.viewState.zoom > preZoomG) {
  //     g = g + 1
  //     preZoomG = view.viewState.zoom
  //     // console.log("ggggg", g)
  //   }
  //   if (g >= 4) {
  //     preZoomG = 1
  //     g = 1

  //     setDisplay("none")
  //     setNondisplay("inherit")
  //     setViewpoint(view.viewState)
  //     console.log("done that shit")
  //   }
  //   // else if (i === 1) {
  //   //   setViewpoint(view.viewState)
  //   // }

  //   // console.log('viewpoint', viewpoint.viewState);
  // }, [])

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
      // .then(console.log("PCCC", PCCC))
      .catch((error) => console.log(`Error:${error}`))
  }

  useEffect(async () => {
    await fetchData(
      "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/json/VS_Info.geojson"
    )
  }, [])
  // Modify the video speed
  // useEffect(() => {
  //   // console.log("videoReference", videoRef.current)
  //   videoRef.current.playbackRate = 0.55
  // }, [])

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
      "Fishing",
      "Midden",
      "Kangaroo",
      "Goanna",
      "Medicine",
      "Tournament",
      "Possum",
      "Turtle",
      "Artefact Scatter",
      "Quarry",
      "Dance",
      "Tracks",
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

  //Layer Loading

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
      <div id="logo">
        <img
          src="https://vs360maiwar.s3-ap-southeast-2.amazonaws.com/img/logo.svg"
          alt="LOGO"
        />
      </div>
      <div className="tabs">
        {/* <StyletronProvider value={engine}>
              <BaseProvider theme={LightTheme}> */}
        <HistoricMap
          viewpoint={viewpoint}
          setViewpoint={setViewpoint}
          historicMap={historicMap}
          setHistoricMap={setHistoricMap}
          setMarker={setMarker}
          setDisplay={setDisplay}
          setNondisplay={setNondisplay}
          setCheckboxes={setCheckboxes}
          checkboxes={checkboxes}
        />
        {/* </BaseProvider>
            </StyletronProvider> */}
      </div>
      {isMobile() && (
        <div className="bearCtrl">
          <BearSlider viewpoint={viewpoint} setViewpoint={setViewpoint} />
        </div>
      )}
      <div
        id="map"
        style={{ display: `${nondisplay}`, width: "100vw", height: "100vh" }}
      >
        <div ref={geocoderContainerRef}>
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
                bottom: "12.4vh",
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
                bottom: "12px",
                left: "0",
                padding: "2px",
              }}
            />
            <NavigationControl
              showCompass={true}
              style={{ bottom: "12px", right: "0px" }}
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
              containerRef={geocoderContainerRef}
              marker={false}
              onViewportChange={handleGeocoderViewportChange}
              mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
              position="top-right"
              positionOptions={{ enableHighAccuracy: true, timeout: 6000 }}
            />
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
            <div className="Toggle3d">
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
              <div className="Text3d">3D</div>
            </div>
            {/* 3d buildings */}
            <div className="Toggle3d2">
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
              <div className="Text3d2">Buildings</div>
            </div>
            {/* layers switch */}
            <div className="Toggle3d3">
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
              <div className="Text3d3">Layers</div>
            </div>
            <Layer {...skyLayer} />
            {building[0] && <Layer {...ThreeDBuildingLayer} />}
            {boundtries && (
              <Source id="boundtries" type="geojson" data={boundtries}>
                <Layer {...boundriesLayer} />
              </Source>
            )}
            {/* region text */}
            {regionsText && (
              <Source id="regions" type="geojson" data={regionsText}>
                <Layer {...regionName} />
              </Source>
            )}
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
            {viewpoint.zoom > 3.1 &&
              viewpoint.zoom < 10 &&
              weatherData.map((place) => {
                return (
                  <Weather
                    zipCode={place.zipCode}
                    location={place.location}
                    city={place.city}
                  />
                )
              })}
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
                closeOnClick={false}
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
              clickInfo.sourceLayer &&
              clickInfo.sourceLayer === "VS_Info" && (
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
                  <PopInfo
                    src={videoUrl}
                    description={clickInfo.properties.description}
                    title={clickInfo.properties.title}
                  />
                </Popup>
              )}
            {popup &&
              clickInfo &&
              clickInfo != null &&
              clickInfo.source.length != 0 &&
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
                  <PopInfo
                    src={videoUrl}
                    description={clickInfo.properties.videoDescription}
                    title={clickInfo.properties.heritageType}
                  />
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
      </div>

      <div className="globe" style={{ display: `${display}` }}>
        {/* <video
          ref={videoRef}
          className="videoTag"
          width="100%"
          height="100%"
          autoPlay
          loop
          muted
        >
          <source
            src="https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/mapSourceImg/galaxy.mp4"
            type="video/mp4"
          />
        </video>
        <div style={{ position: "absolute", top: "50vh", left: "50vw" }}>
          <BounceLoader color="#5AAEBD" />
        </div> */}

        <Viewer
          full
          terrainProvider={terrainProvider}
          ref={earthRef}
          // skyBox={false}
          // skyAtmosphere={false}
          // contextOptions={{
          //   webgl: {
          //     alpha: false,
          //   },
          // }}
        >
          <SkyBox
          // sources={{
          //   positiveX:
          //     "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/mapSourceImg/left.png",
          //   negativeX:
          //     "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/mapSourceImg/right.png",
          //   positiveY:
          //     "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/mapSourceImg/top.png",
          //   negativeY:
          //     "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/mapSourceImg/bottom.png",
          //   positiveZ:
          //     "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/mapSourceImg/front.png",
          //   negativeZ:
          //     "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/mapSourceImg/back.png",
          // }}
          />
          <Entity
            position={Cartesian3.fromDegrees(152.9794409, -27.5084143, 200)}
            point={pointGraphics}
            name="Hi! There!"
            description="This is our office location, which is Creative Industries Precinct, Z3/106 Musk Ave, Kelvin Grove QLD 4059"
          />
          <CameraFlyTo
            cancelFlightOnUnmount
            destination={Cartesian3.fromDegrees(
              152.9794409,
              -27.5084143,
              32000000
            )}
            once
            duration={15}
            orientation={{
              heading: CesiumMath.toRadians(0),
              pitch: CesiumMath.toRadians(-90),
            }}
          />
          <Camera onChange={handleChangeView} />
          <Scene backgroundColor={Color.TRANSPARENT} />
          <Globe
            enableLighting
            // showGroundAtmosphere
            // showWaterEffect
            // dynamicAtmosphereLighting
            // dynamicAtmosphereLightingFromSun
            // showSkirts
          />
        </Viewer>
      </div>
    </div>
  )
}

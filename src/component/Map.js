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
// import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import "./map.css"
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
  mapRasterLayer,
  PCCCIconsLayer,
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
import { Provider as StyletronProvider } from "styletron-react"
import { LightTheme, BaseProvider, styled } from "baseui"
import { Tabs, Tab, ORIENTATION, FILL } from "baseui/tabs-motion"
import { Checkbox, STYLE_TYPE } from "baseui/checkbox"
import Geocoder from "react-map-gl-geocoder"
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"
import Storage from "@aws-amplify/storage"
import HistoricMap from "./HistoricMap"
import { withStyles } from "@material-ui/core/styles"
import axios from "axios"
import BearSlider from "./BearSlider"

mapboxgl.workerClass = MapboxWorker
const engine = new Styletron()

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
    width: window.innerWidth,
    height: window.innerHeight,
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

  //Spinner state control
  const [loading, setLoading] = useState(false)
  //Display  different historic map

  //Toggle button of 3d map
  const [checkboxes, setCheckboxes] = React.useState([false, false])
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
  // Fetch the Layer GeoJson data for display
  // useEffect(() => {
  //   /* global fetch */
  //   fetch(
  //     "https://amplifylanguageappgidarjil114226-dev.s3-ap-southeast-2.amazonaws.com/public/wordlist/features.geojson"
  //   )
  //     .then((res) => res.json())
  //     .then((json) => setAllData(json))
  // }, [])

  useEffect(async () => {
    checkboxes[0]
      ? await setViewpoint({
          ...viewpoint,
          pitch: 75,
          bearing: 0,
        })
      : await setViewpoint({
          ...viewpoint,
          pitch: 0,
          bearing: 0,
        })
  }, [checkboxes[0]])
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

  const handleViewportChange = useCallback((viewpoint) => {
    setViewpoint(viewpoint)
  }, [])

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
        console.log("Get the data", res.data)
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
  return (
    <div className="body" id="body">
      <Sidebar
        pageWrapId={"map"}
        outerContainerId={"body"}
        locateUser={locateUser}
      />
      <div className="bearCtrl">
        <BearSlider viewpoint={viewpoint} setViewpoint={setViewpoint} />
      </div>

      <div id="map">
        <ReactMapGl
          ref={mapRef}
          {...viewpoint}
          mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
          onViewportChange={handleViewportChange}
          // mapStyle="mapbox://styles/mapbox/satellite-streets-v11"

          mapStyle="mapbox://styles/guneriboi/ckp69hfy90ibu18pimha653fd"
          //Define the interactive layer
          // interactiveLayerIds={[unclusteredPointLayer.id]}
          onClick={onClick}
          // onLoad={onMapLoad}
        >
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
          />
          <div className="tabs">
            <StyletronProvider value={engine}>
              <BaseProvider theme={LightTheme}>
                <HistoricMap
                  viewpoint={viewpoint}
                  setViewpoint={setViewpoint}
                  historicMap={historicMap}
                  setHistoricMap={setHistoricMap}
                />
              </BaseProvider>
            </StyletronProvider>
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
            <h1 className="logoText">VIRTUAL SONGLINES</h1>
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
            <div className="Text3d">3D</div>
          </div>
          <Layer {...skyLayer} />
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
          {/* {console.log("geooooooooooooo", geoConvertedjson)} */}
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
          {historicMap.url.length != 0 && (
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

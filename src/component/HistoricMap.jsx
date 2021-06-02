import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import ReactMapGl, { FlyToInterpolator } from "react-map-gl"
import { Tabs, Tab, ORIENTATION, FILL } from "baseui/tabs-motion"

export default function HistoricMap(props) {
  const { viewpoint, setViewpoint, historicMap, setHistoricMap } = props
  //Tabs Control
  const [activeKey, setActiveKey] = useState("0")

  //map data
  const mapData = [
    {
      name: "Brisbane 1798",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Brisbane 1798.jpg",
      coordinates: [
        [152.962180055, -27.395],
        [153.114333621, -27.395],
        [153.114334004, -27.547],
        [152.962180049, -27.547],
      ],
      zoom: 12.3,
      pitch: 60,
      bearing: 20,
      longitude: 153.03807,
      latitude: -27.4710546,
    },
    {
      name: "Brisbane 1800",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Brisbane 1800.jpg",
      coordinates: [
        [152.986169867, -27.431091701],
        [153.06911081, -27.431092428],
        [153.06911057, -27.5039584],
        [152.98616963, -27.50395853],
      ],
      zoom: 13.5,
      pitch: 40,
      bearing: 50,
      longitude: 153.03807,
      latitude: -27.4710546,
    },
    {
      name: "Brisbane 1816",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Brisbane 1816.jpg",
      coordinates: [
        [152.986703201, -27.433308598],
        [153.067839548, -27.433308606],
        [153.067839426, -27.496577538],
        [152.986703314, -27.496577923],
      ],
      zoom: 13.5,
      pitch: 30,
      bearing: 0,
      longitude: 153.03107,
      latitude: -27.4680546,
    },
    {
      name: "Brisbane 1823",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Brisbane 1823.jpg",
      coordinates: [
        [152.9862592, -27.431079139],
        [153.069036275, -27.431079583],
        [153.06903676, -27.50401404],
        [152.986259278, -27.504012586],
      ],
      zoom: 13,
      pitch: 40,
      bearing: 40,
      longitude: 153.03807,
      latitude: -27.4710546,
    },
    {
      name: "Brisbane 1858",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Brisbane 1858.jpg",
      coordinates: [
        [153.009207, -27.442971],
        [153.055312, -27.448955],
        [153.045831, -27.505405],
        [152.999768, -27.499457],
      ],
      zoom: 14,
      pitch: 60,
      bearing: 40,
      longitude: 153.03807,
      latitude: -27.4710546,
    },
  ]
  return (
    <>
      <Tabs
        activeKey={activeKey}
        onChange={({ activeKey }) => setActiveKey(activeKey)}
        orientation={ORIENTATION.vertical}
        activateOnFocus
        fill={FILL.fixed}
      >
        {mapData.map((map, id) => {
          return (
            <Tab
              key={id}
              title={map.name}
              onClick={() => {
                setHistoricMap({
                  url: map.url,
                  coordinates: map.coordinates,
                })
                setViewpoint({
                  ...viewpoint,
                  longitude: map.longitude,
                  latitude: map.latitude,
                  zoom: map.zoom,
                  pitch: map.pitch,
                  bearing: map.bearing,
                  transitionInterpolator: new FlyToInterpolator({
                    speed: 1.7,
                  }),
                  transitionDuration: "auto",
                })
              }}
            ></Tab>
          )
        })}
        <Tab
          title="Now"
          onClick={() => {
            setHistoricMap({
              url: "",
              coordinates: "",
            })
            setViewpoint({
              ...viewpoint,
            })
          }}
        ></Tab>
      </Tabs>
    </>
  )
}

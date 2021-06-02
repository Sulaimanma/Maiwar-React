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

  //Map1798

  const map1798 = {
    url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/MeeanjinMap1798.jpg",
    coordinates: [
      [152.962180055, -27.395],
      [153.114333621, -27.395],
      [153.114334004, -27.547],
      [152.962180049, -27.547],
    ],
  }
  //Brisbane 1800

  const Brisbane1800 = {
    url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/BrisbaneMap1800.jpg",
    // url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/germanyHigh.svg",
    coordinates: [
      [152.986169867, -27.431091701],
      [153.06911081, -27.431092428],
      [153.06911057, -27.5039584],
      [152.98616963, -27.50395853],
    ],
  }
  //Brisbane 1823
  const Brisbane1823 = {
    url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/BrisbaneMap1823.jpg",
    // url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/germanyHigh.svg",
    coordinates: [
      [152.9862592, -27.431079139],
      [153.069036275, -27.431079583],
      [153.06903676, -27.50401404],
      [152.986259278, -27.504012586],
    ],
  }

  //Map1858

  const map1858 = {
    url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/cad-map-brisbane-1858.jpg",
    // url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/germanyHigh.svg",
    coordinates: [
      [153.009207, -27.442971],
      [153.055312, -27.448955],
      [153.045831, -27.505405],
      [152.999768, -27.499457],
    ],
  }
  return (
    <>
      <Tabs
        activeKey={activeKey}
        onChange={({ activeKey }) => setActiveKey(activeKey)}
        orientation={ORIENTATION.vertical}
        activateOnFocus
        fill={FILL.fixed}
      >
        <Tab
          title="Greater Meeanjin 1798"
          onClick={() => {
            setHistoricMap({
              url: map1798.url,
              coordinates: map1798.coordinates,
            })
            setViewpoint({
              ...viewpoint,
              longitude: 153.03807,
              latitude: -27.4710546,
              zoom: 12.3,
              pitch: 60,
              bearing: 20,
              transitionInterpolator: new FlyToInterpolator({
                speed: 1.7,
              }),
              transitionDuration: "auto",
            })
          }}
        ></Tab>

        <Tab
          title="Brisbane 1823"
          onClick={() => {
            setHistoricMap({
              url: Brisbane1823.url,
              coordinates: Brisbane1823.coordinates,
            })
            setViewpoint({
              ...viewpoint,
              longitude: 153.02754,
              latitude: -27.4741875,
              zoom: 13,
              pitch: 40,
              bearing: 40,
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
              zoom: 14,
              pitch: 60,
              bearing: 40,
              transitionInterpolator: new FlyToInterpolator({
                speed: 1.7,
              }),
              transitionDuration: "auto",
            })
          }}
        ></Tab>
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

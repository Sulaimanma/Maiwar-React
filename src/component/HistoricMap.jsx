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
      zoom: 11.8,
      pitch: 60,
      bearing: 20,
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
      zoom: 13.3,
      pitch: 40,
      bearing: -20,
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
    },
    {
      name: "Kurrungul 1816",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Kurrungul 1816.jpg",
      coordinates: [
        [153.334676793, -27.92300396],
        [153.421868742, -27.923004024],
        [153.421868742, -28.00243441],
        [153.3346765, -28.00243748],
      ],
      zoom: 13,
      pitch: 60,
      bearing: 40,
    },
    {
      name: "Warrane 1786",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Warrane 1786.jpg",
      coordinates: [
        [151.177312199, -33.835356359],
        [151.24336813, -33.83535825],
        [151.243368311, -33.88910107],
        [151.177312216, -33.889101051],
      ],
      zoom: 13.7,
      pitch: 60,
      bearing: 40,
    },
    {
      name: "Warrane 1787",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Warrane 1787.jpg",
      coordinates: [
        [151.177312199, -33.835356359],
        [151.24336813, -33.83535825],
        [151.243368311, -33.88910107],
        [151.177312216, -33.889101051],
      ],
      zoom: 13.7,
      pitch: 60,
      bearing: 40,
    },
    {
      name: "Kamay 1770",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Kamay 1770.jpg",
      coordinates: [
        [151.112236975, -33.888807613],
        [151.226556753, -33.888807052],
        [151.22655846, -33.97830052],
        [151.11223661, -33.97829088],
      ],
      zoom: 13,
      pitch: 60,
      bearing: 40,
    },
    {
      name: "Wadjuk Boodjar 1816",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Wadjuk Boodjar 1816.jpg",
      coordinates: [
        [115.84148433, -31.94268772],
        [115.871902048, -31.942686081],
        [115.871902038, -31.969304669],
        [115.841483696, -31.969304798],
      ],
      zoom: 15,
      pitch: 60,
      bearing: 40,
    },
    {
      name: "Birrarung 1834",
      url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Birrarung+1834.jpg",
      coordinates: [
        [144.88455012, -37.77141853],
        [145.01453333, -37.77141671],
        [145.01453428, -37.87208986],
        [144.884549443, -37.87208482],
      ],
      zoom: 12.5,
      pitch: 60,
      bearing: 40,
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
                  longitude:
                    (map.coordinates[0][0] + map.coordinates[1][0]) / 2,
                  latitude:
                    (map.coordinates[0][1] + map.coordinates[1][1]) / 2 - 0.034,
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

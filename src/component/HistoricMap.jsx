import React, { useState, useEffect, useCallback } from "react"
import { FlyToInterpolator } from "react-map-gl"
import { Tabs, Tab, ORIENTATION, FILL } from "baseui/tabs-motion"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import "./historicMap.css"
import { RiArrowLeftSLine } from "react-icons/ri"
import { HiOutlineDotsVertical } from "react-icons/hi"
import Slider from "@material-ui/core/Slider"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"

import { MdExpandMore } from "react-icons/md"

import { useRef } from "react"

export default function HistoricMap(props) {
  const {
    viewpoint,
    setViewpoint,
    historicMap,
    setHistoricMap,
    setMarker,
    setDisplay,
    setNondisplay,
    checkboxes,
    setCheckboxes,
  } = props
  //Tabs Control
  // const [activeKey, setActiveKey] = useState("0")

  const [mapValue, setMapValue] = useState({
    value: 100,
    label: "Maiwar 1798",
    url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Brisbane 1798.jpg",
    coordinates: [
      [152.962180055, -27.395],
      [153.114333621, -27.395],
      [153.114334004, -27.547],
      [152.962180049, -27.547],
    ],
    zoom: 1,
    pitch: 60,
    bearing: 20,
  })
  const [barValue, setBarValue] = useState(100)
  const [CSSControl, setCSSControl] = useState("sliderDiv")
  const [swipe, setSwipe] = useState("swipeLeft")
  const mapData = [
    {
      state: "Torres Strait",
      regionMaps: [],
    },
    { state: "East Cape", regionMaps: [] },
    {
      state: "Rainforest",
      regionMaps: [
        {
          value: 31.1,
          label: "Bwgcolman 1770",
          url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Palm Island.jpg",
          coordinates: [
            [146.5275676, -18.6398716],
            [146.69722193, -18.63985544],
            [146.6972289, -18.8091968],
            [146.527562, -18.8091668],
          ],
          zoom: 12.2,
          pitch: 75,
          bearing: -40,
        },
      ],
    },
    {
      state: "Northeast",
      regionMaps: [
        {
          value: 100,
          label: "Maiwar 1798",
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
          value: 94.7,
          label: "Maiwar 1800",
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
          value: 84.1,
          label: "Maiwar 1816",
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
          value: 78.8,
          label: "Maiwar 1823",
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
          value: 73.5,
          label: "Maiwar 1858",
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
          value: 20.5,
          label: "Karalee 1826",
          url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Karalee 1826.jpg",
          coordinates: [
            [152.7351484, -27.5856311],
            [152.78985938, -27.58561056],
            [152.7898663, -27.6340426],
            [152.73516, -27.6340303],
          ],
          zoom: 13.5,
          pitch: 45,
          bearing: 40,
        },
        {
          value: 9.9,
          label: "Meerooni 1770",
          url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Meerooni 1770.jpg",
          coordinates: [
            [151.8317444, -24.146476],
            [151.9212295, -24.1465335],
            [151.92125171, -24.22584685],
            [151.83173973, -24.22584432],
          ],
          zoom: 13.5,
          pitch: 45,
          bearing: 40,
        },
      ],
    },
    {
      state: "Riverine",
      regionMaps: [
        {
          value: 15.2,
          label: "Toowoomba 1830",
          url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Toowoomba 1830.jpg",
          coordinates: [
            [151.8909577, -27.5061305],
            [152.010741, -27.506273],
            [152.010706, -27.616335],
            [151.890993, -27.61635],
          ],
          zoom: 13.5,
          pitch: 45,
          bearing: 40,
        },

        {
          value: 4.6,
          label: "Oakey 1830",
          url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Oakey 1830.jpg",
          coordinates: [
            [151.705706, -27.432911],
            [151.7275535, -27.4325134],
            [151.72756741, -27.45180908],
            [151.7057197, -27.4518239],
          ],
          zoom: 14,
          pitch: 45,
          bearing: 40,
        },
        {
          value: 0,
          label: "Brewarrina 1876",
          url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Brewarrina.jpg",
          coordinates: [
            [146.8355683, -29.9401134],
            [146.87441244, -29.94009897],
            [146.874411461, -29.973468028],
            [146.835553179, -29.973467828],
          ],
          zoom: 14,
          pitch: 45,
          bearing: 40,
        },
      ],
    },
    {
      state: "Southeast",
      regionMaps: [
        {
          value: 68.2,
          label: "Kurrungul 1816",
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
          value: 62.9,
          label: "Warrane 1786",
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
          value: 57.6,
          label: "Warrane 1787",
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
          value: 52.3,
          label: "Kamay 1770",
          url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Kamay 1770.jpg",
          coordinates: [
            [151.0783961, -33.8815799],
            [151.2524791, -33.8815922],
            [151.2524814, -34.024334],
            [151.0783893, -34.0243134],
          ],
          zoom: 13,
          pitch: 60,
          bearing: 40,
        },
        {
          value: 36.4,
          label: "Birrarung 1834",
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
        {
          value: 25.8,
          label: "Kambera 1816",
          url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Canberra 1816.jpg",
          coordinates: [
            [149.0942832, -35.2591583],
            [149.1650571, -35.2590921],
            [149.1650594, -35.3073807],
            [149.0942855, -35.3074128],
          ],
          zoom: 13.5,
          pitch: 60,
          bearing: 40,
        },
      ],
    },
    { state: "Tasmania", regionMaps: [] },
    { state: "Eyre", regionMaps: [] },
    { state: "Gulf", regionMaps: [] },
    { state: "West Cape", regionMaps: [] },
    { state: "Desert", regionMaps: [] },
    { state: "Spencer", regionMaps: [] },
    { state: "Arnhem", regionMaps: [] },
    { state: "North", regionMaps: [] },
    { state: "Fitzmaurice", regionMaps: [] },
    { state: "Kimberley", regionMaps: [] },
    { state: "Northwest", regionMaps: [] },
    {
      state: "Southwest",
      regionMaps: [
        {
          value: 47,
          label: "Whadjuk Boodjar 1816",
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
          value: 41.7,
          label: "Greater Whadjuk 1829",
          url: "https://maiwar-react-storage04046-devsecond.s3-ap-southeast-2.amazonaws.com/public/mapSourceImg/Greater Whadjuk 1829.jpg",
          coordinates: [
            [115.6712002, -31.8120689],
            [116.0266805, -31.8121643],
            [116.0266686, -32.1096078],
            [115.67119825, -32.10960083],
          ],
          zoom: 10.6,
          pitch: 60,
          bearing: 40,
        },
      ],
    },
  ]
  const mapDataChange = mapData.map((item, id) => {
    item.value = 100 - id * 5.26315789
    return item
  })
  //First render custom hook
  function useFirstRender() {
    const firstRender = useRef(1)

    useEffect(() => {
      firstRender.current = firstRender.current + 1
    }, [mapValue])

    return firstRender.current
  }
  const firstRender = useFirstRender()

  useEffect(() => {
    // if (firstRender >= 3) {
    //   setDisplay("none")
    //   setNondisplay("inherit")
    // }
    setDisplay("none")
    setNondisplay("inherit")
    const longi = (mapValue.coordinates[0][0] + mapValue.coordinates[1][0]) / 2
    const lati =
      (mapValue.coordinates[0][1] + mapValue.coordinates[1][1]) / 2 - 0.034
    setHistoricMap({
      url: mapValue.url,
      coordinates: mapValue.coordinates,
    })
    setViewpoint({
      ...viewpoint,
      longitude: longi,
      latitude: lati,
      zoom: mapValue.zoom,
      pitch: mapValue.pitch,
      bearing: mapValue.bearing,
      transitionInterpolator: new FlyToInterpolator({
        speed: 1.7,
      }),
      transitionDuration: "auto",
    })
    setMarker({
      latitude: lati,
      longitude: longi,
    })
    console.log(firstRender)
  }, [mapValue, firstRender])

  const PrettoSlider = withStyles({
    root: {
      color: "#52af77",
      height: 8,
    },
    thumb: {
      height: 14,
      width: 14,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
    },

    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider)

  const handleChange = useCallback(async (value) => {
    const current = await mapData.map((state, id) => {
      return state.regionMaps.filter((region, id) => {
        return region.label === value
      })
    })
    const currentRegion = current.filter((region) => region.length != 0)
    console.log("findit", currentRegion[0][0])
    // const valueChange = current[0]
    // setBarValue(valueChange.value)
    setMapValue(currentRegion[0][0])
  }, [])
  return (
    <>
      {/* <Tabs
        activeKey={activeKey}
        onChange={({ activeKey }) => setActiveKey(activeKey)}
        orientation={ORIENTATION.vertical}
        activateOnFocus
        fill={FILL.fixed}
      >
        {mapData.map((map, id) => {
          const longi = (map.coordinates[0][0] + map.coordinates[1][0]) / 2
          const lati =
            (map.coordinates[0][1] + map.coordinates[1][1]) / 2 - 0.034
          console.log("debug the error", longi, lati)
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
                  longitude: longi,
                  latitude: lati,
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
      </Tabs> */}
      <TransitionGroup>
        <CSSTransition key={CSSControl} classNames={swipe} timeout={600}>
          <div className={CSSControl}>
            {CSSControl === "sliderDiv" ? (
              <RiArrowLeftSLine
                className="slideLeft"
                onClick={() => {
                  setSwipe("swipeLeft")
                  setCSSControl("sliderDivHide")
                }}
              />
            ) : (
              <HiOutlineDotsVertical
                className="slideRight"
                onClick={() => {
                  setSwipe("swipeRight")
                  setCSSControl("sliderDiv")
                }}
              />
            )}
            {/* <PrettoSlider
              orientation="vertical"
              defaultValue={barValue}
              getAriaValueText={handleChange}
              aria-labelledby="discrete-slider-restrict"
              step={null}
              marks={mapDataChange}
              track={false}
            /> */}
            <div className="list">
              {mapData.map((state, id) => {
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<MdExpandMore />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        <div className="state">{state.state}</div>
                      </Typography>
                    </AccordionSummary>
                    {state.regionMaps.map((region, id) => {
                      return (
                        <AccordionDetails>
                          <Typography>
                            <div
                              className="region"
                              onClick={(e) => {
                                handleChange(e.target.innerText)
                              }}
                            >
                              {" "}
                              {region.label}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      )
                    })}
                  </Accordion>
                )
              })}
            </div>{" "}
          </div>
        </CSSTransition>{" "}
      </TransitionGroup>{" "}
    </>
  )
}

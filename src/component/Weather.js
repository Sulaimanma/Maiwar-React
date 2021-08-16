import React, { useEffect, useState } from "react"
import { Marker } from "react-map-gl"
import "./weather.css"
const apikey = "8042786b38064cbb82786b3806fcbbf9"

export default function Weather(props) {
  const { zipCode, location, city } = props
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  //   const mainCitiesAu = [{ zipCode: "4001", location: [-27.470125, 153.021072] }]
  let temperature
  let weatherType
  let iconCode

  useEffect(() => {
    fetch(
      `https://api.weather.com/v3/wx/forecast/hourly/2day?postalKey=${zipCode}:AU&units=e&language=en-US&format=json&apiKey=${apikey}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
      .then((data) => {
        setWeather(data)
      })
      .catch((error) => {
        console.error("error in fetching weather data", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  if (weather != null) {
    temperature = ((weather.temperature[0] - 32) * 0.5556).toFixed(1)
    weatherType = weather.precipType[0]
    iconCode = weather.iconCode[0]
  } else {
    temperature = 0
    weatherType = "sun"
    iconCode = "21"
  }
  const iconUrl = `https://doc.media.weather.com/products/icons/${iconCode}.png`

  // console.log("fetch", temperature, weatherType, iconCode)
  return (
    <Marker
      longitude={location[1]}
      latitude={location[0]}
      offsetTop={-20}
      offsetLeft={-10}

      //   draggable
      //   onDragStart={onMarkerDragStart}
      //   onDrag={onMarkerDrag}
      //   onDragEnd={onMarkerDragEnd}
    >
      {/* <DragPin
        size={30}
        clickFunction={() => {
          setEnter(true)
        }}
      /> */}
      {loading ? null : (
        <div className="iconDiv">
          <div className="weatherDiv">
            <div className="city">{city}</div>

            <div className="temperature">{temperature}°C</div>
          </div>
          <div className="imgDiv">
            <img className="weatherIcon" src={iconUrl}></img>
          </div>
        </div>
      )}
    </Marker>
  )
}

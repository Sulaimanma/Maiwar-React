import React from "react"
import "./popinfo.css"
export default function PopInfo(props) {
  const { src, description, title } = props
  // console.log("Video src in the popinfo", src)
  return (
    <div className="popContainer">
      <h3 className="title">{title}</h3>
      {src && src != "" && src !== ".mp4" && (
        <video autoPlay loop muted width="300px" src={src} />
      )}

      <p className="description">{description}</p>
    </div>
  )
}

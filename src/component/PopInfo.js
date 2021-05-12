import React from "react"
import "./popinfo.css"
export default function PopInfo(props) {
  const { src, description, title } = props
  return (
    <div className="popContainer">
      <h3 className="title">{title}</h3>
      {src && src != "" && (
        <video autoPlay loop muted width="300px" src={src} />
      )}
      {console.log("srccccccc", src)}

      <p className="description">{description}</p>
    </div>
  )
}

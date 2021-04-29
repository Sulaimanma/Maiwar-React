import React from "react";
import "./popinfo.css";
export default function PopInfo(props) {
  return (
    <div className="popContainer">
      <video autoPlay loop muted width="300px" height="300px" src={props.src} />
    </div>
  );
}

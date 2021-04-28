import React from "react";

export default function PopInfo(props) {
  return (
    <div>
      <video autoPlay loop muted width="300px" height="300px" src={props.src} />
    </div>
  );
}

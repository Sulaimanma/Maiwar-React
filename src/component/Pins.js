import React from "react";
import { Marker } from "react-map-gl";
import { FcVideoCall } from "react-icons/fc";
export default function Pins(props) {
  const { data, onClick } = props;
  return data.features
    .filter(function (place) {
      return place.properties.VideoName.length != 0 && place.properties;
    })
    .map((place, id) => (
      <Marker
        id={place.id}
        longitude={place.geometry.coordinates[0]}
        latitude={place.geometry.coordinates[1]}
        offsetLeft={17}
        offsetTop={-12}
        onClick={onClick}
      >
        <FcVideoCall style={{ fontSize: "23px" }} />
      </Marker>
    ));
}

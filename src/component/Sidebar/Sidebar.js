import React from "react"
import { elastic as Menu } from "react-burger-menu"

export default (props) => {
  return (
    // Pass on our props
    <Menu {...props}>
      <p
        className="menu-item"
        onClick={props.locateUser}
        style={{ cursor: "pointer" }}
      >
        Drop Pin
      </p>

      <p className="menu-item" style={{ cursor: "pointer" }}>
        About
      </p>

      <p className="menu-item" style={{ cursor: "pointer" }}>
        Services
      </p>

      <p className="menu-item" style={{ cursor: "pointer" }}>
        Contact us
      </p>
    </Menu>
  )
}

import React from "react"
import { elastic as Menu } from "react-burger-menu"

export default (props) => {
  return (
    // Pass on our props
    <Menu {...props}>
      <a className="menu-item" onClick={props.locateUser}>
        Label
      </a>

      <a className="menu-item">About</a>

      <a className="menu-item">Services</a>

      <a className="menu-item">Contact us</a>
    </Menu>
  )
}

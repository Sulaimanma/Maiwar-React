import React, { useState } from "react"
import { elastic as Menu } from "react-burger-menu"

export default (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen)
    props.locateUser()
  }

  return (
    // Pass on our props
    <Menu
      {...props}
      isOpen={isMenuOpen}
      onOpen={() => {
        setIsMenuOpen(true)
      }}
      onClose={() => {
        setIsMenuOpen(false)
      }}
    >
      {console.log("開了沒", isMenuOpen)}
      <p
        className="menu-item"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        Drop Pin to Add Heritages
      </p>

      <p className="menu-item" style={{ cursor: "pointer" }}>
        Upload Heritages
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

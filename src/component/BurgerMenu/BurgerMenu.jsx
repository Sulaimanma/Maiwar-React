import React, { useEffect } from "react";
// import { FaSignOutAlt, FaSignInAlt, FaInfoCircle } from "react-icons/fa";
// import { scaleRotate as Menu } from "react-burger-menu"; //scaleRotate

// import classes from "./BurgerMenu.module.scss";
// import { QuizContext } from "../../Helpers/Contexts";
import { menuStyles } from "../Styles/sidebar";
import { Sidebar } from "../Sidebar/Sidebar";

export const BurgerMenu = props => {
  useEffect(() => {
    if (props.nonSticky) {
      menuStyles.bmBurgerButton.position = "absolute";
    } else {
      menuStyles.bmBurgerButton.position = "fixed";
    }
  }, [props.nonSticky]);
  const hideButton = {
    display: "none",
  };
  return (
    <div id="App">
      <Sidebar
        // pageWrapId={'page-wrap'}
        outerContainerId={"App"}
        styles={props.hide ? hideButton : menuStyles}
      />
      {props.children}
    </div>
  );
};

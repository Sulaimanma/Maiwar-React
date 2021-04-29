// import { scaleDown } from "react-stack-grid/lib/animations/transitions";

export const menuStyles = {
  bmBurgerButton: {
    position: "fixed",
    width: "35px",
    height: "28px",
    left: "1rem",
    top: "1rem",
    zIndex: "999",
    filter: "drop-shadow(0px 0px 2px grey)",
  },
  bmBurgerBars: {
    background: "#fff",
    borderRadius: "25px",
    transition: "all 0.3s",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
    transition: "all 0.3s",
  },
  bmCrossButton: {
    top: "4rem",
    left: "10rem",
    width: "41px",
    height: "41px",
  },
  bmCross: {
    background: "#fff",
    height: "2rem",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
    zIndex: "10000",
  },
  bmMenu: {
    background: "#1A1A1A",
    boxShadow: ".5px .5px 10px #1A1A1A",
    width: "70%",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: " #fff",
  },
  bmItem: {
    textDecoration: "none",
    transition: "color 0.2s",
  },
  bmOverlay: {
    zIndex: "1999",
    background: "rgba(0, 0, 0, 0.5)",
  },
};

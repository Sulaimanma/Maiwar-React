import React from "react"

import PropTypes from "prop-types"
import { withStyles, makeStyles } from "@material-ui/core/styles"
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}))

function ValueLabelComponent(props) {
  const { children, open, value } = props

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  )
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
}

const marks = [
  {
    value: 0,
  },
  {
    value: 20,
  },
  {
    value: 37,
  },
  {
    value: 100,
  },
]

const PrettoSlider = withStyles({
  root: {
    color: "rgb(31 40 24)",
    height: 8,
    width: 500,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider)

export default function BearSlider({ viewpoint, setViewpoint }) {
  const classes = useStyles()
  const handleChange = async (value) => {
    const bearingValue = (await (value.target.ariaValueNow / 100)) * 360
    setViewpoint({ ...viewpoint, bearing: bearingValue })
  }

  return (
    <div className={classes.root}>
      <div className={classes.margin} />

      <PrettoSlider
        // valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={0}
        onChange={handleChange}
      />

      <div className={classes.margin} />
    </div>
  )
}

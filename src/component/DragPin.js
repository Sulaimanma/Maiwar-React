import * as React from "react"
import { TiPlus } from "react-icons/ti"

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`
const ICON1 = `M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z`
const pinStyle = {
  fill: "#d00",
  stroke: "none",
}

function Pin(props) {
  const { size = 20 } = props

  return (
    <>
      {/* <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
        <path d={ICON} />
      </svg> */}
      <div
        style={{
          position: "relative",
          right: "56px",
          top: "7px",
          borderRadius: "60%",
          background: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100px",
          height: "100px",
        }}
      >
        {" "}
        <div>
          <img
            width={80}
            height={80}
            src="https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/img/icons/Bora.png"
            alt="LOGO"
          />
        </div>
      </div>
    </>
  )
}

export default React.memo(Pin)

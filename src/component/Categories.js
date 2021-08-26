import { Button } from "@material-ui/core"
import React from "react"
import { Col, Container, Row } from "react-bootstrap"
import { FlyToInterpolator } from "react-map-gl"
import "../component/Categories.css"
import { mapData } from "./HistoricMap"

export default function Categories(props) {
  const { setViewpoint, viewpoint, setDisplay, setNondisplay } = props

  const categories = [
    {
      tittle: "Oral tradition",
      tittleBackground:
        "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/img/icons/Crossing.png",
      img: "",
      pitch: 60.30213601881513,
      zoom: 15.451941083083048,
      bearing: -11.4375,
      latitude: -27.476833478134672,
      longitude: 153.03005250303866,
    },
    {
      tittle: "Astronomy",
      tittleBackground:
        "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/img/icons/Midden.png",
      img: "",
      latitude: -27.48368957052321,
      longitude: 153.031413050344,
      zoom: 14.5,
      pitch: 25,
      bearing: 90,
    },
    {
      tittle: "Art and crafts",
      tittleBackground:
        "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/img/icons/Artefact+Scatter.png",
      img: "",
      latitude: -27.48368957052321,
      longitude: 153.031413050344,
      zoom: 14.5,
      pitch: 25,
      bearing: 90,
    },
    {
      tittle: "Music",
      tittleBackground:
        "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/img/icons/Bora.png",
      img: "",
      latitude: -27.48368957052321,
      longitude: 153.031413050344,
      zoom: 14.5,
      pitch: 0,
      bearing: 90,
    },
  ]

  return (
    <Container style={{ display: "flex", justifyContent: "center" }}>
      <div className="CategoriesDiv">
        {categories.map((cate) => {
          const longi = cate.longitude
          const lati = cate.latitude
          return (
            <Col key={cate.tittle}>
              <Row>
                {" "}
                <Button
                  onClick={() => {
                    setDisplay("none")
                    setNondisplay("inherit")
                    setViewpoint({
                      ...viewpoint,
                      longitude: longi,
                      latitude: lati,
                      zoom: cate.zoom,
                      pitch: cate.pitch,
                      bearing: cate.bearing,
                      transitionInterpolator: new FlyToInterpolator({
                        speed: 1.7,
                      }),
                      transitionDuration: "auto",
                    })
                  }}
                >
                  <img
                    src={cate.tittleBackground}
                    style={{ width: "50px" }}
                    className="cateIcon"
                  ></img>
                </Button>
              </Row>
              <Row>
                {" "}
                <div className="cateTittle">{cate.tittle}</div>
              </Row>
            </Col>
          )
        })}
      </div>
    </Container>
  )
}

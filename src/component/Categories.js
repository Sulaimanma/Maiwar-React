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
    },
    {
      tittle: "Astronomy",
      tittleBackground:
        "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/img/icons/Midden.png",
      img: "",
    },
    {
      tittle: "Art and crafts",
      tittleBackground:
        "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/img/icons/Artefact+Scatter.png",
      img: "",
    },
    {
      tittle: "Music",
      tittleBackground:
        "https://maiwar-react-storage04046-devsecond.s3.ap-southeast-2.amazonaws.com/public/img/icons/Bora.png",
      img: "",
    },
  ]

  return (
    <Container style={{ display: "flex", justifyContent: "center" }}>
      <div className="CategoriesDiv">
        {categories.map((cate) => {
          const mapValue = mapData
            .find((region) => region.state == "Northeast")
            .regionMaps.find((city) => city.tag == cate.tittle)

          const longi =
            (mapValue.coordinates[0][0] + mapValue.coordinates[1][0]) / 2
          const lati =
            (mapValue.coordinates[0][1] + mapValue.coordinates[1][1]) / 2 -
            0.034
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
                      zoom: mapValue.zoom,
                      pitch: mapValue.pitch,
                      bearing: mapValue.bearing,
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

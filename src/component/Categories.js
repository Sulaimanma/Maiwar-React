import { Button } from "@material-ui/core"
import React from "react"
import { Col, Container, Row } from "react-bootstrap"
import "../component/Categories.css"
export default function Categories() {
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
    <Container>
      <Row className="CategoriesDiv">
        {categories.map((cate) => (
          <Col key={cate.tittle}>
            <Row>
              {" "}
              <Button>
                <img
                  src={cate.tittleBackground}
                  style={{ width: "50px" }}
                ></img>
              </Button>
            </Row>
            <Row>
              {" "}
              <div className="cateTittle">{cate.tittle}</div>
            </Row>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

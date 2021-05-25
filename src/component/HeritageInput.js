import React, { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { Form as Bootform } from "react-bootstrap"
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik"
import { stringify, v4 as uuid } from "uuid"
import * as yup from "yup"
import "./heritageInput.css"
import { AiFillDelete } from "react-icons/ai"
import API, { graphqlOperation } from "@aws-amplify/api"
import { createHeritages } from "../graphql/mutations"
import Storage from "@aws-amplify/storage"

import RingLoader from "react-spinners/RingLoader"
import { Modal } from "bootstrap"

export default function HeritageInput(props) {
  const [videoData, setVideoData] = useState("")

  const [imageData, setImageData] = useState("")
  const [officerSignature, setOfficerSignature] = useState([])
  const [advisorSignature, setAdvisor] = useState("")
  const [coordinator, setCoordinator] = useState("")
  const [examined, setExamined] = useState("false")
  const [identified, setIdentified] = useState("false")
  const [json, setJson] = useState()
  const [officerArray, setOfficerArray] = useState([])

  const { latitude, longitude, fetchHeritages, setEnter, loading, setLoading } =
    props
  const schema = yup.object().shape({
    // terms: yup.bool().required().oneOf([true], "terms must be accepted"),
    //new scgema
    surveyDate: yup.string().required("Survey date is required"),
    siteNumber: yup.string().required("Site number is required"),
    GPSCoordinates: yup.array().of(
      yup.object().shape({
        datum: yup.string().required("Datum is required"),
        easting: yup.string().required("Easting is required"),
        northing: yup.string().required("Northing is required"),
      })
    ),
    routeExaminedOrNot: yup
      .boolean()
      .required("Existing access route examined or not is required"),
    examinedRouteLocation: yup.string().optional(),

    accessRouteCoordinate: yup.array().of(
      yup.object().shape({
        routeCoordinate: yup.string().optional("Access route is required"),
      })
    ),

    inspectionPerson: yup.string().required("required"),
    InspectionCarriedOut: yup.string().required("required"),
    photo: yup.mixed().optional(),
    photoDescription: yup.string().optional(),
    video: yup.mixed().optional(),
    videoDescription: yup.string().optional(),
    visibility: yup.string().required("required"),
    siteIssue: yup.string().optional(),
    identifiedOrNot: yup.boolean().required("required"),
    additionalComments: yup.string().optional(),
    clearedToProceed: yup.boolean().optional(),
    heritageFieldOfficer: yup.array().of(
      yup.object().shape({
        officerName: yup.string().required("Access route is required"),
        officerSignature: yup.string().required("Access route is required"),
      })
    ),
    technicalAdvisor: yup.array().of(
      yup.object().shape({
        advisorName: yup.string().required("Access route is required"),
        advisorSignature: yup.string().required("Access route is required"),
      })
    ),
    coordinator: yup.array().of(
      yup.object().shape({
        coordinatorName: yup.string().required("Access route is required"),
        coordinatorSignature: yup.string().required("Access route is required"),
      })
    ),
  })
  const initialValues = {
    surveyDate: "",
    siteNumber: "",
    GPSCoordinates: [
      {
        datum: "",
        easting: "",
        northing: "",
      },
    ],
    routeExaminedOrNot: false,
    examinedRouteLocation: "",

    accessRouteCoordinate: [
      {
        routeCoordinate: "",
      },
    ],
    inspectionPerson: "",
    InspectionCarriedOut: "",
    photo: {},
    photoDescription: "",
    video: {},
    videoDescription: "",
    visibility: "",
    siteIssue: "",
    identifiedOrNot: false,
    additionalComments: "",
    clearedToProceed: false,
    heritageFieldOfficer: [
      {
        officerName: "",
        officerSignature: {},
      },
    ],
    technicalAdvisor: [
      {
        advisorName: "",
        advisorSignature: {},
      },
    ],
    coordinator: [
      {
        coordinatorName: "",
        coordinatorSignature: {},
      },
    ],
  }
  //Spinner

  const handleSubmitForm = async (json) => {
    const Photokey = await Storage.put(
      `img/${uuid()}${imageData.name}`,
      imageData,
      {
        contentType: "image/png,image/jpeg,image/jpg",
        level: "public",
      }
    )
    const Videokey = await Storage.put(
      `video/${uuid()}${videoData.name}`,
      videoData,
      {
        contentType: "video/mp4",
        level: "public",
      }
    )

    const OfficerArr = officerSignature.map(async (officer) => {
      try {
        const SignatureImg = await Storage.put(
          `img/${uuid()}${officer.name}`,
          officer,
          {
            contentType: "image/png,image/jpeg,image/jpg",
            level: "public",
          }
        )
        return SignatureImg
      } catch (error) {
        console.log("error in mapping", error)
      }
    })

    const AdvisorKey = await Storage.put(
      `img/${uuid()}${advisorSignature.name}`,
      advisorSignature,
      {
        contentType: "image/png,image/jpeg,image/jpg",
        level: "public",
      }
    )

    const coordinatorKey = await Storage.put(
      `img/${uuid()}${coordinator.name}`,
      coordinator,
      {
        contentType: "image/png,image/jpeg,image/jpg",
        level: "public",
      }
    )
    try {
      const initialJSON = JSON.parse(json)

      initialJSON.photo = Photokey
      initialJSON.video = Videokey
      initialJSON.technicalAdvisor[0].advisorSignature = AdvisorKey
      initialJSON.coordinator[0].coordinatorSignature = coordinatorKey

      initialJSON.heritageFieldOfficer.map((officer, index) => {
        OfficerArr[index].then((result) => {
          const signatureImg = result.key
          officer.officerSignature = signatureImg
        })
      })

      //Submit
      var str = "officers"
      var object = {}
      setOfficerArray(initialJSON.heritageFieldOfficer)

      officerArray.length != 0 && (object[str] = officerArray)

      console.log("officerPre", object)
      console.log("officer")

      const createHeritageInput = {
        id: uuid(),
        surveyDate: initialJSON.surveyDate,
        siteNumber: initialJSON.siteNumber,
        GPSCoordinates: JSON.stringify(initialJSON.GPSCoordinates),
        routeExaminedOrNot: initialJSON.routeExaminedOrNot,
        examinedRouteLocation: initialJSON.examinedRouteLocation,
        accessRouteCoordinate: JSON.stringify(
          initialJSON.accessRouteCoordinate
        ),
        inspectionPerson: initialJSON.inspectionPerson,
        InspectionCarriedOut: initialJSON.InspectionCarriedOut,
        photo: initialJSON.photo,
        photoDescription: initialJSON.photoDescription,
        video: initialJSON.video,
        videoDescription: initialJSON.videoDescription,
        visibility: initialJSON.visibility,
        siteIssue: initialJSON.siteIssue,
        identifiedOrNot: initialJSON.identifiedOrNot,
        additionalComments: initialJSON.additionalComments,
        clearedToProceed: initialJSON.clearedToProceed,
        heritageFieldOfficer: JSON.stringify(object),
        technicalAdvisor: JSON.stringify(initialJSON.technicalAdvisor),
        coordinator: JSON.stringify(initialJSON.coordinator),
      }
      console.log("before submit", createHeritageInput.heritageFieldOfficer)
      const data = initialJSON.heritageFieldOfficer
      var obj = ""
      for (let i = 0; i < data.length; i++) {
        obj = obj + JSON.stringify(data[i])
        console.log("medium", obj)
      }
      console.log(
        "final problem",
        JSON.stringify(initialJSON.heritageFieldOfficer)
      )
      await API.graphql(
        graphqlOperation(createHeritages, { input: createHeritageInput })
      )
      // fetchHeritages()
      //   .then(() => setLoading(false))
      //   .then(() => setEnter(false))
      //   .then(() => alert("upLoading hsa been done!"))

      console.log("initialJSON", initialJSON)
    } catch (error) {
      console.log("error in submitting", error)
    }
  }

  return (
    <Container>
      <div
        style={{
          height: "1024px",
          width: "768px",
          overflowY: "scroll",
          overflowX: "hidden",
          marginLeft: "14px",
        }}
      >
        {loading ? (
          <RingLoader />
        ) : (
          <div>
            <div
              style={{
                textAlign: "center",
                marginBottom: "18px",
                paddingRight: "35px",
              }}
            >
              <h4 style={{ fontWeight: "600" }}>
                Cultural Heritage Inspection Form
              </h4>
            </div>

            <Formik
              validationSchema={schema}
              // onSubmit={(values) => {
              //   handleSubmitForm(values)
              // }}
              initialValues={initialValues}
              render={({ values, handleSubmit }) => (
                <Form>
                  <Row className="formRow">
                    <Col>
                      <label style={{ fontWeight: "600" }}>Survey date:</label>
                      <Field
                        placeholder="Survey date:"
                        name={`surveyDate`}
                      ></Field>

                      <Row>
                        <Col className="errorMessage">
                          <ErrorMessage
                            name={`surveyDate`}
                            className="invalid-feedback"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <label style={{ fontWeight: "600" }}>Site number:</label>
                      <Field
                        placeholder="Site number:"
                        name={`siteNumber`}
                      ></Field>
                      <Row>
                        <Col className="errorMessage">
                          <ErrorMessage
                            name={`siteNumber`}
                            className="invalid-feedback"
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="formRow">
                    <label style={{ fontWeight: "600" }}>
                      GPS coordinates of Survey Area:
                    </label>
                  </Row>

                  <FieldArray
                    name=" GPSCoordinates"
                    render={(arrayHelpers) => {
                      const GPSCoordinates = values.GPSCoordinates
                      return (
                        <div>
                          {GPSCoordinates && GPSCoordinates.length > 0
                            ? GPSCoordinates.map((coordinate, index) => (
                                <div>
                                  <Row
                                    key={index}
                                    style={{ width: "100%" }}
                                    className="formRow"
                                  >
                                    <Col>
                                      <label style={{ fontWeight: "500" }}>
                                        Datum:
                                      </label>
                                      <Row>
                                        <Col>
                                          {" "}
                                          <Field
                                            placeholder="datum"
                                            name={`GPSCoordinates.${index}.datum`}
                                          ></Field>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col className="errorMessage">
                                          <ErrorMessage
                                            name={`GPSCoordinates.${index}.datum`}
                                            className="errorMessage"
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col>
                                      <label style={{ fontWeight: "500" }}>
                                        Easting:
                                      </label>
                                      <Field
                                        placeholder="easting"
                                        name={`GPSCoordinates.${index}.easting`}
                                      ></Field>
                                      <Row>
                                        <Col className="errorMessage">
                                          <ErrorMessage
                                            name={`GPSCoordinates.${index}.easting`}
                                            className="invalid-feedback"
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col>
                                      <label style={{ fontWeight: "500" }}>
                                        Northing:
                                      </label>
                                      <Field
                                        placeholder="northing"
                                        name={`GPSCoordinates.${index}.northing`}
                                      ></Field>
                                      <Row>
                                        <Col className="errorMessage">
                                          <ErrorMessage
                                            name={`GPSCoordinates.${index}.northing`}
                                            className="invalid-feedback"
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              ))
                            : null}
                        </div>
                      )
                    }}
                  ></FieldArray>

                  <Row className="formRow">
                    <label style={{ fontWeight: "600" }}>
                      Existing access route examined or not?
                    </label>
                  </Row>
                  <Row
                    onChange={(e) => {
                      setExamined(e.target.value)
                    }}
                  >
                    <Col md={1}>
                      <label style={{ display: "block" }}>
                        <Field
                          type="radio"
                          name="routeExaminedOrNot"
                          value={`${true}`}
                        />
                        Yes
                      </label>
                      <ErrorMessage
                        name={`routeExaminedOrNot`}
                        className="invalid-feedback"
                      />
                    </Col>
                    <Col>
                      <label style={{ display: "block" }}>
                        <Field
                          type="radio"
                          name="routeExaminedOrNot"
                          value={`${false}`}
                        />
                        No
                      </label>
                      <ErrorMessage
                        name={`routeExaminedOrNot`}
                        className="invalid-feedback"
                      />
                    </Col>
                  </Row>

                  {examined === "true" ? (
                    <>
                      <Row>
                        <label style={{ fontWeight: "600" }}>
                          Existing access route examined location:
                        </label>
                      </Row>
                      <Row className="formRow">
                        <Col md={{ span: 8 }}>
                          <Field
                            placeholder="Location"
                            name={`examinedRouteLocation`}
                          ></Field>
                          <ErrorMessage
                            name={`examinedRouteLocation`}
                            className="invalid-feedback"
                          />
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <div>
                      <Row className="formRow">
                        <label style={{ fontWeight: "600" }}>
                          Access route coordinates if no existing track:
                        </label>
                      </Row>

                      <FieldArray
                        name="accessRouteCoordinate"
                        render={(arrayHelpers) => {
                          const accessRouteCoordinate =
                            values.accessRouteCoordinate
                          return (
                            <div>
                              {accessRouteCoordinate &&
                              accessRouteCoordinate.length > 0
                                ? accessRouteCoordinate.map(
                                    (coordinate, index) => (
                                      <div>
                                        <Row key={index}>
                                          <Col>
                                            <label
                                              style={{ marginRight: "15px" }}
                                            >{`Access route ${
                                              index + 1
                                            }:`}</label>
                                            <Field
                                              placeholder="routeCoordinate"
                                              name={`accessRouteCoordinate.${index}.routeCoordinate`}
                                            ></Field>
                                            <ErrorMessage
                                              name={`accessRouteCoordinate.${index}.routeCoordinate`}
                                              className="invalid-feedback"
                                            />
                                          </Col>
                                          <Col>
                                            <AiFillDelete
                                              style={{
                                                color: "red",
                                                cursor: "pointer",
                                                fontSize: "27px",
                                              }}
                                              onClick={() =>
                                                arrayHelpers.remove(index)
                                              } // remove a route from the list
                                            />
                                          </Col>
                                        </Row>
                                      </div>
                                    )
                                  )
                                : null}
                              <Row>
                                <Col>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    block
                                    onClick={() =>
                                      arrayHelpers.push({
                                        routeCoordinate: "",
                                      })
                                    } // insert an empty string at a position
                                  >
                                    Add a route
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          )
                        }}
                      ></FieldArray>
                    </div>
                  )}
                  <Row className="formRow">
                    <Col>
                      <label style={{ fontWeight: "600" }}>
                        Who conducted the inspection?
                      </label>
                      <Field
                        placeholder="Who conducted the inspection?"
                        name={`inspectionPerson`}
                        style={{ marginLeft: "10px" }}
                      ></Field>
                      <div className="errorMessage">
                        <ErrorMessage
                          name={`inspectionPerson`}
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="formRow">
                    <Col>
                      <label style={{ fontWeight: "600" }}>
                        How was the Inspection carried out?
                      </label>
                      <Field
                        placeholder="How was the Inspection carried out?"
                        name={`InspectionCarriedOut`}
                        style={{ width: "400px", marginLeft: "10px" }}
                      ></Field>
                      <div className="errorMessage">
                        <ErrorMessage
                          name={`InspectionCarriedOut`}
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ fontWeight: "600" }} className="formRow">
                    <Bootform.Group>
                      <Bootform.File
                        className="position-relative"
                        label="Photographs: "
                        onChange={(e) => setImageData(e.target.files[0])}
                        accept="image/"
                      />
                    </Bootform.Group>
                  </Row>
                  <Row>
                    <Col>
                      <label>Description of the photo: </label>
                      <Field
                        placeholder="Description of the photo"
                        name={`photoDescription`}
                        style={{ width: "400px", marginLeft: "10px" }}
                      ></Field>
                      <ErrorMessage
                        name={`photoDescription`}
                        className="invalid-feedback"
                      />
                    </Col>
                  </Row>
                  <Row style={{ fontWeight: "600" }} className="formRow">
                    <Bootform.Group>
                      <Bootform.File
                        className="position-relative"
                        label="Videos: "
                        onChange={(e) => setVideoData(e.target.files[0])}
                        accept="video"
                      />
                    </Bootform.Group>
                  </Row>
                  <Row>
                    <Col>
                      <label>Description of the video: </label>
                      <Field
                        placeholder="Description of the video: "
                        name={`videoDescription`}
                        style={{ width: "400px", marginLeft: "10px" }}
                      ></Field>

                      <ErrorMessage
                        name={`videoDescription`}
                        className="invalid-feedback"
                      />
                    </Col>
                  </Row>

                  <Row className="formRow">
                    <label style={{ fontWeight: "600" }}>
                      Characteristics of area
                    </label>
                  </Row>
                  <Row>
                    <Col md={10}>
                      <Field
                        as="textarea"
                        placeholder="eg. visibility of the ground: grassy, low surface visibility, high surface visibility, rocky etc"
                        name={`visibility`}
                        style={{ width: "500px" }}
                      ></Field>
                      <div className="errorMessage">
                        <ErrorMessage
                          name={`visibility`}
                          className="errorMessage"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="formRow">
                    <label style={{ fontWeight: "600" }}>
                      Site specific issues:
                    </label>
                  </Row>
                  <Row>
                    <Col md={{ span: 8 }}>
                      <Field
                        as="textarea"
                        placeholder="Summarize the site specific issue if it has"
                        name={`siteIssue`}
                        style={{ width: "500px" }}
                      ></Field>
                      <ErrorMessage
                        name={`siteIssue`}
                        className="invalid-feedback"
                      />
                    </Col>
                  </Row>
                  <Row className="formRow">
                    <label style={{ fontWeight: "600" }}>
                      Was any Aboriginal Cultural Heritage identified?
                    </label>
                  </Row>
                  <Row
                    onChange={(e) => {
                      setIdentified(e.target.value)
                    }}
                  >
                    <Col md={1}>
                      <label>
                        <Field
                          type="radio"
                          name="identifiedOrNot"
                          value={`${true}`}
                        />
                        Yes
                      </label>
                      <ErrorMessage
                        name={`identifiedOrNot`}
                        className="invalid-feedback"
                      />
                    </Col>
                    <Col>
                      {" "}
                      <label>
                        <Field
                          type="radio"
                          name="identifiedOrNot"
                          value={`${false}`}
                        />
                        No
                      </label>
                      <ErrorMessage
                        name={`identifiedOrNot`}
                        className="invalid-feedback"
                      />
                    </Col>
                  </Row>
                  {identified === "true" ? (
                    <div>
                      <Row>
                        <label>Please add additional comments:</label>
                      </Row>
                      <Row>
                        <Col md={{ span: 8 }}>
                          <Field
                            as="textarea"
                            placeholder="Recommendations "
                            name={`additionalComments`}
                          ></Field>
                          <ErrorMessage
                            name={`additionalComments`}
                            className="invalid-feedback"
                          />
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <div>
                      <Row className="formRow">
                        <Col>
                          <label style={{ fontWeight: "600" }}>
                            If no, are project activities cleared to proceed
                            immediately?
                          </label>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={1}>
                          {" "}
                          <label>
                            <Field
                              type="radio"
                              name="clearedToProceed"
                              value={`${true}`}
                            />
                            Yes
                          </label>
                          <ErrorMessage
                            name={`clearedToProceed`}
                            className="invalid-feedback"
                          />
                        </Col>
                        <Col>
                          <label>
                            <Field
                              type="radio"
                              name="clearedToProceed"
                              value={`${false}`}
                            />
                            No
                          </label>
                          <ErrorMessage
                            name={`clearedToProceed`}
                            className="invalid-feedback"
                          />
                        </Col>
                      </Row>
                    </div>
                  )}
                  <Row className="formRow">
                    <label style={{ fontWeight: "600" }}>
                      The Cultural Heritage Field Officers warrant they have
                      traditional knowledge and authority for the Activity Area:
                    </label>
                  </Row>
                  <FieldArray
                    name="heritageFieldOfficer"
                    render={(arrayHelpers) => {
                      const heritageFieldOfficer = values.heritageFieldOfficer
                      return (
                        <div>
                          {heritageFieldOfficer &&
                          heritageFieldOfficer.length > 0
                            ? heritageFieldOfficer.map((officer, index) => (
                                <div>
                                  <Row key={index}>
                                    <Col>
                                      <label style={{ marginRight: "15px" }}>
                                        Name in full:
                                      </label>
                                      <Field
                                        name={`heritageFieldOfficer.${index}.officerName`}
                                      ></Field>
                                      <div className="errorMessage">
                                        <ErrorMessage
                                          name={`heritageFieldOfficer.${index}.officerName`}
                                          className="invalid-feedback"
                                        />
                                      </div>
                                    </Col>
                                    <Col>
                                      <Bootform.Group>
                                        <Bootform.File
                                          className="position-relative"
                                          label="Signature:"
                                          onChange={(e) =>
                                            setOfficerSignature([
                                              ...officerSignature,
                                              e.target.files[0],
                                            ])
                                          }
                                          accept="image/"
                                        />
                                      </Bootform.Group>
                                    </Col>
                                    <Col>
                                      <AiFillDelete
                                        style={{
                                          color: "red",
                                          cursor: "pointer",
                                          fontSize: "27px",
                                          marginTop: "23px",
                                        }}
                                        onClick={(e) => {
                                          arrayHelpers.remove(index)

                                          setOfficerSignature(
                                            officerSignature.filter(
                                              (item, id) => id !== index
                                            )
                                          )
                                        }} // remove a route from the list
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              ))
                            : null}
                          <Row style={{ marginTop: "5px" }}>
                            <Col>
                              <Button
                                variant="success"
                                size="sm"
                                block
                                onClick={() =>
                                  arrayHelpers.push({
                                    officerName: "",
                                    officerSignature: "",
                                  })
                                } // insert an empty string at a position
                              >
                                Add a Officer
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      )
                    }}
                  ></FieldArray>
                  <Row className="formRow">
                    <label style={{ fontWeight: "600" }}>
                      Technical advisor (where attending):
                    </label>
                  </Row>

                  <FieldArray
                    name="technicalAdvisor"
                    render={(arrayHelpers) => {
                      const technicalAdvisor = values.technicalAdvisor
                      return (
                        <div>
                          {technicalAdvisor && technicalAdvisor.length > 0
                            ? technicalAdvisor.map((advisor, index) => (
                                <div>
                                  <Row key={index} style={{ width: "100%" }}>
                                    <Col>
                                      <label>Name:</label>
                                      <Row>
                                        <Col>
                                          {" "}
                                          <Field
                                            placeholder="Advisor Name"
                                            name={`technicalAdvisor.${index}.advisorName`}
                                          ></Field>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col className="errorMessage">
                                          <ErrorMessage
                                            name={`technicalAdvisor.${index}.advisorName`}
                                            className="errorMessage"
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col>
                                      <Bootform.Group>
                                        <Bootform.File
                                          className="position-relative"
                                          label="Signature:"
                                          onChange={(e) =>
                                            setAdvisor(e.target.files[0])
                                          }
                                          accept="image/"
                                        />
                                      </Bootform.Group>
                                    </Col>
                                  </Row>
                                </div>
                              ))
                            : null}
                        </div>
                      )
                    }}
                  ></FieldArray>
                  <Row className="formRow">
                    <label style={{ fontWeight: "600" }}>
                      Proponent Cultural Heritage Coordinator:
                    </label>
                  </Row>
                  <FieldArray
                    name="coordinator"
                    render={(arrayHelpers) => {
                      const coordinator = values.coordinator
                      return (
                        <div>
                          {coordinator && coordinator.length > 0
                            ? coordinator.map((coordinator, index) => (
                                <div>
                                  <Row key={index} style={{ width: "100%" }}>
                                    <Col>
                                      <label>Name:</label>
                                      <Row>
                                        <Col>
                                          <Field
                                            placeholder="Coordinator Name"
                                            name={`coordinator.${index}.coordinatorName`}
                                          ></Field>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col className="errorMessage">
                                          <ErrorMessage
                                            name={`coordinator.${index}.coordinatorName`}
                                            className="errorMessage"
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col>
                                      <Bootform.Group>
                                        <Bootform.File
                                          className="position-relative"
                                          label="Signature:"
                                          onChange={(e) =>
                                            setCoordinator(e.target.files[0])
                                          }
                                          accept="image/"
                                        />
                                      </Bootform.Group>
                                    </Col>
                                  </Row>
                                </div>
                              ))
                            : null}
                        </div>
                      )
                    }}
                  ></FieldArray>

                  {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
                  {setJson(JSON.stringify(values, 0, 2))}
                  <Row style={{ marginTop: "6px" }}>
                    <Col>
                      <Button
                        variant="primary"
                        // type="submit"

                        onClick={() => {
                          handleSubmitForm(json)
                        }}
                      >
                        Submit form
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            />
          </div>
        )}
      </div>
    </Container>
  )
}

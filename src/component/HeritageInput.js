import React, { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { Form as Bootform } from "react-bootstrap"
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik"
import { v4 as uuid } from "uuid"
import * as yup from "yup"
import "./heritageInput.css"
import { AiFillDelete } from "react-icons/ai"
import API, { graphqlOperation } from "@aws-amplify/api"
import { createHeritage } from "../graphql/mutations"
import Storage from "@aws-amplify/storage"

import RingLoader from "react-spinners/RingLoader"

export default function HeritageInput(props) {
  const [videoData, setVideoData] = useState("")
  const [audioData, setAudioData] = useState("")
  const [imageData, setImageData] = useState("")
  const [officerSignature, setOfficerSignature] = useState([])
  const [advisorSignature, setAdvisor] = useState("")
  const [coordinator, setCoordinator] = useState("")
  const [examined, setExamined] = useState("false")
  const [identified, setIdentified] = useState("false")

  const { latitude, longitude, fetchHeritages, setEnter, loading, setLoading } =
    props
  const schema = yup.object().shape({
    // terms: yup.bool().required().oneOf([true], "terms must be accepted"),
    //new scgema
    surveyDate: yup.date("date is invalid").required("Survey date is required"),
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
        officerName: yup.string().optional("Access route is required"),
        officerSignature: yup.string().optional("Access route is required"),
      })
    ),
    technicalAdvisor: yup.string().required(),
    coordinator: yup.string().required(),
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
    photo: "",
    photoDescription: "",
    video: "",
    videoDescription: "",
    visibility: "",
    siteIssue: "",
    identifiedOrNot: false,
    additionalComments: "",
    clearedToProceed: false,
    heritageFieldOfficer: [
      {
        officerName: "",
        officerSignature: "",
      },
    ],
    technicalAdvisor: "",
    coordinator: "",
  }
  //Spinner
  // Can be a string as well. Need to ensure each key-value pair ends with ;

  const AddHeritage = async (values) => {
    try {
      const {
        title,
        description,
        creator,
        video_file,
        audio_file,
        image_file,
      } = values
      setLoading(true)
      const Videokey = await Storage.put(`video/${uuid()}.mp4`, videoData, {
        contentType: "video/mp4",
        level: "public",
      })

      const Audiokey = await Storage.put(`audio/${uuid()}.mp3`, audioData, {
        contentType: "audio/mp3",
      })
      const Imagekey = await Storage.put(`img/${uuid()}.jpg`, audioData, {
        contentType: "image/png,image/jpeg,image/jpg",
      })
      const createHeritageInput = {
        id: uuid(),
        title,
        description,
        Icon: title,
        VideoName: Videokey.key,
        AudioName: Audiokey.key,
        SceneToLoad: "test",
        uuid: 1,
        user: creator,
        latitude: latitude,
        longitude: longitude,
        ImageName: Imagekey.key,
      }

      await API.graphql(
        graphqlOperation(createHeritage, { input: createHeritageInput })
      )

      fetchHeritages()
        .then(() => setLoading(false))
        .then(() => setEnter(false))
        .then(() => console.log("fetch good boy"))
    } catch (error) {
      console.log("error when uploading is", error)
    }
  }
  const onSubmit = async (values) => {
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <div style={{ height: "400px", overflowY: "scroll", overflowX: "hidden" }}>
      {loading ? (
        <RingLoader />
      ) : (
        <Formik
          validationSchema={schema}
          onSubmit={onSubmit}
          initialValues={initialValues}
          render={({ values, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <label>Survey date:</label>
                  <Field placeholder="Survey date:" name={`surveyDate`}></Field>
                  <ErrorMessage
                    name={`surveyDate`}
                    className="invalid-feedback"
                  />
                </Col>
                <Col>
                  <label>Site number:</label>
                  <Field placeholder="Site number:" name={`siteNumber`}></Field>
                  <ErrorMessage
                    name={`siteNumber`}
                    className="invalid-feedback"
                  />
                </Col>
              </Row>
              <Row>
                <label>GPS coordinates of Survey Area:</label>
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
                              <Row key={index} style={{ width: "100%" }}>
                                <Col>
                                  <label>Datum:</label>
                                  <Field
                                    placeholder="datum"
                                    name={`GPSCoordinates.${index}.datum`}
                                  ></Field>
                                  <ErrorMessage
                                    name={`GPSCoordinates.${index}.datum`}
                                    className="invalid-feedback"
                                  />
                                </Col>
                                <Col>
                                  <label>Easting:</label>
                                  <Field
                                    placeholder="easting"
                                    name={`GPSCoordinates.${index}.easting`}
                                  ></Field>
                                  <ErrorMessage
                                    name={`GPSCoordinates.${index}.easting`}
                                    className="invalid-feedback"
                                  />
                                </Col>
                                <Col>
                                  <label>Northing:</label>
                                  <Field
                                    placeholder="northing"
                                    name={`GPSCoordinates.${index}.northing`}
                                  ></Field>
                                  <ErrorMessage
                                    name={`GPSCoordinates.${index}.northing`}
                                    className="invalid-feedback"
                                  />
                                </Col>
                              </Row>
                            </div>
                          ))
                        : null}
                    </div>
                  )
                }}
              ></FieldArray>

              <Row>
                <label>Existing access route examined or not?</label>
              </Row>
              <Row
                onChange={(e) => {
                  setExamined(e.target.value)
                  console.log("examined", examined)
                }}
              >
                <label>
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

                <label>
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
              </Row>

              {examined === "true" ? (
                <Row>
                  <Col md={{ span: 8 }}>
                    <label>Existing access route examined location:</label>
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
              ) : (
                <div>
                  <Row>
                    <label>
                      Access route coordinates if no existing track:
                    </label>
                  </Row>

                  <FieldArray
                    name="accessRouteCoordinate"
                    render={(arrayHelpers) => {
                      const accessRouteCoordinate = values.accessRouteCoordinate
                      return (
                        <div>
                          {accessRouteCoordinate &&
                          accessRouteCoordinate.length > 0
                            ? accessRouteCoordinate.map((coordinate, index) => (
                                <div>
                                  <Row key={index}>
                                    <Col>
                                      <label
                                        style={{ marginRight: "15px" }}
                                      >{`Access route ${index + 1}:`}</label>
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
                              ))
                            : null}
                          <Row>
                            <Col>
                              <Button
                                variant="success"
                                size="small"
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
              <Row>
                <Col>
                  <label>Who conducted the inspection?</label>
                  <Field
                    placeholder="Who conducted the inspection?"
                    name={`inspectionPerson`}
                  ></Field>
                  <ErrorMessage
                    name={`inspectionPerson`}
                    className="invalid-feedback"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label>How was the Inspection carried out?</label>
                  <Field
                    placeholder="How was the Inspection carried out?"
                    name={`InspectionCarriedOut`}
                  ></Field>
                  <ErrorMessage
                    name={`InspectionCarriedOut`}
                    className="invalid-feedback"
                  />
                </Col>
              </Row>
              <Row>
                <Bootform.Group>
                  <Bootform.File
                    className="position-relative"
                    name="photo"
                    label="Photographs: "
                    onChange={(e) => setImageData(e.target.files[0])}
                    accept="image/"
                  />
                  <ErrorMessage name={`photo`} className="invalid-feedback" />
                </Bootform.Group>
              </Row>
              <Row>
                <Col>
                  <label>Description of the photo: </label>
                  <Field
                    placeholder="Description of the photo"
                    name={`photoDescription`}
                  ></Field>
                  <ErrorMessage
                    name={`photoDescription`}
                    className="invalid-feedback"
                  />
                </Col>
              </Row>
              <Row>
                <Bootform.Group>
                  <Bootform.File
                    className="position-relative"
                    name="video"
                    label="Videos: "
                    onChange={(e) => setVideoData(e.target.files[0])}
                    accept="video"
                  />
                  <ErrorMessage name={`video`} className="invalid-feedback" />
                </Bootform.Group>
              </Row>
              <Row>
                <Col>
                  <label>Description of the video: </label>
                  <Field
                    placeholder="Description of the video: "
                    name={`videoDescription`}
                  ></Field>
                  <ErrorMessage
                    name={`videoDescription`}
                    className="invalid-feedback"
                  />
                </Col>
              </Row>

              <Row>
                <label>
                  Characteristics of area – visibility of the ground: (grassy,
                  low surface visibility, high surface visibility, rocky etc)
                </label>
              </Row>
              <Row>
                <Col md={{ span: 8 }}>
                  <Field
                    as="textarea"
                    placeholder="Characteristics of area: "
                    name={`visibility`}
                  ></Field>
                  <ErrorMessage
                    name={`visibility`}
                    className="invalid-feedback"
                  />
                </Col>
              </Row>
              <Row>
                <label>
                  If discussion of site specific issues, then summarise:
                </label>
              </Row>
              <Row>
                <Col md={{ span: 8 }}>
                  <Field
                    as="textarea"
                    placeholder="Site issue summarize: "
                    name={`siteIssue`}
                  ></Field>
                  <ErrorMessage
                    name={`siteIssue`}
                    className="invalid-feedback"
                  />
                </Col>
              </Row>
              <Row>
                <label>Was any Aboriginal Cultural Heritage identified?</label>
              </Row>
              <Row
                onChange={(e) => {
                  setIdentified(e.target.value)
                }}
              >
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
                  <Row>
                    <Col>
                      <label>
                        If NO, are Project Activities cleared to proceed
                        immediately?
                      </label>
                    </Col>
                  </Row>
                  <Row>
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
                  </Row>
                </div>
              )}
              <Row>
                <label>
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
                      {heritageFieldOfficer && heritageFieldOfficer.length > 0
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
                                  <ErrorMessage
                                    name={`heritageFieldOfficer.${index}.officerName`}
                                    className="invalid-feedback"
                                  />
                                </Col>
                                <Col>
                                  <Bootform.Group>
                                    <Bootform.File
                                      className="position-relative"
                                      name={`heritageFieldOfficer.${index}.officerSignature`}
                                      label="Signature:"
                                      onChange={(e) =>
                                        setOfficerSignature([
                                          ...officerSignature,
                                          e.target.files[0],
                                        ])
                                      }
                                      accept="image/"
                                    />
                                    {console.log("Sign", officerSignature)}
                                    <ErrorMessage
                                      name={`officerSignature`}
                                      className="invalid-feedback"
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
                      <Row>
                        <Col>
                          <Button
                            variant="success"
                            size="small"
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
              <Row>
                <label>Technical advisor (where attending):</label>
              </Row>
              <Row>
                <Col>
                  <Field name={`technicalAdvisor`}></Field>
                  <ErrorMessage
                    name={`technicalAdvisor`}
                    className="invalid-feedback"
                  />
                </Col>
                <Col>
                  <Bootform.Group>
                    <Bootform.File
                      className="position-relative"
                      label="Signature:"
                      onChange={(e) => setAdvisor(e.target.files[0])}
                      accept="image/"
                    />
                  </Bootform.Group>
                </Col>
              </Row>

              <Row>
                <label>Proponent Cultural Heritage Coordinator:</label>
              </Row>
              <Row>
                <Col>
                  <Field name={`coordinator`}></Field>
                  <ErrorMessage
                    name={`coordinator`}
                    className="invalid-feedback"
                  />
                </Col>
                <Col>
                  <Bootform.Group>
                    <Bootform.File
                      className="position-relative"
                      label="Signature:"
                      onChange={(e) => setCoordinator(e.target.files[0])}
                      accept="image/"
                    />
                  </Bootform.Group>
                </Col>
              </Row>
              {console.log(JSON.stringify(values, 0, 2))}
              {/* <Form.Group as={Col} md="4" controlId="validationFormik103">
                <Form.Label>Creator</Form.Label>
                <Form.Control
                  type="text"
                  name="creator"
                  value={values.creator}
                  onChange={handleChange}
                  isValid={touched.creator && !errors.creator}
                />

                <Form.Control.Feedback tooltip>
                  Looks good!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.File
                  className="position-relative"
                  optional
                  name="video_file"
                  label="Video"
                  onChange={(e) => setVideoData(e.target.files[0])}
                  isInvalid={!!errors.video_file}
                  feedback={errors.video_file}
                  id="validationFormik107"
                  feedbackTooltip
                  accept="video/mp4"
                />
              </Form.Group>
              <Form.Group>
                <Form.File
                  className="position-relative"
                  optional
                  name="audio_file"
                  label="Audio"
                  onChange={(e) => setAudioData(e.target.files[0])}
                  isInvalid={!!errors.audio_file}
                  feedback={errors.audio_file}
                  id="validationFormik108"
                  feedbackTooltip
                  accept="audio/mp3"
                />
              </Form.Group>
              <Form.Group>
                <Form.File
                  className="position-relative"
                  optional
                  name="image_file"
                  label="Image"
                  onChange={(e) => setImageData(e.target.files[0])}
                  isInvalid={!!errors.image_file}
                  feedback={errors.image_file}
                  id="validationFormik109"
                  feedbackTooltip
                  accept="image/png,image/jpeg,image/jpg"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  name="terms"
                  label="Agree to terms and conditions"
                  onChange={handleChange}
                  isInvalid={!!errors.terms}
                  feedback={errors.terms}
                  id="validationFormik106"
                  feedbackTooltip
                />
              </Form.Group> */}

              <Button variant="primary" type="submit">
                Submit form
              </Button>
            </Form>
          )}
        >
          {/* {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => } */}
        </Formik>
      )}
    </div>
  )
}

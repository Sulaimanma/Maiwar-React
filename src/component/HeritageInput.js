import React, { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik"
import { v4 as uuid } from "uuid"
import * as yup from "yup"
import { AiFillDelete } from "react-icons/ai"
import API, { graphqlOperation } from "@aws-amplify/api"
import { createHeritage } from "../graphql/mutations"
import Storage from "@aws-amplify/storage"

import RingLoader from "react-spinners/RingLoader"

export default function HeritageInput(props) {
  const [videoData, setVideoData] = useState("")
  const [audioData, setAudioData] = useState("")
  const [imageData, setImageData] = useState("")
  const [examined, setExamined] = useState("false")
  const [identified, setIdentified] = useState(true)

  const { latitude, longitude, fetchHeritages, setEnter, loading, setLoading } =
    props
  const schema = yup.object().shape({
    // title: yup.string().required(),
    // description: yup.string().required(),

    // video_file: yup.mixed().optional(),
    // image_file: yup.mixed().optional(),
    // audio_file: yup.mixed().optional(),
    // terms: yup.bool().required().oneOf([true], "terms must be accepted"),
    // creator: yup.string().required(),
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
    HeritageFieldOfficer: yup.string().required(),
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
    HeritageFieldOfficer: "",
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
    <div>
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
                              {" "}
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

              {/* 
           
              
              <fieldset>
                <Form.Group>
                  <Form.Label>
                    Existing access route examined or not?
                  </Form.Label>

                  <Form.Check
                    type="radio"
                    label="Yes"
                    onChange={() => {
                      setExamined(true)
                    }}
                    name="routeExaminedOrNot"
                    id="formHorizontalRadios1"
                  />
                  <Form.Check
                    type="radio"
                    label="No"
                    onChange={() => {
                      setExamined(false)
                    }}
                    name="routeExaminedOrNot"
                    id="formHorizontalRadios2"
                  />
                </Form.Group>
              </fieldset>
              {examined ? (
                <Form.Group>
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    type="text"
                    name="examinedRouteLocation"
                    value={values.examinedRouteLocation}
                    onChange={handleChange}
                    // isValid={
                    //   touched.examinedRouteLocation &&
                    //   !errors.examinedRouteLocation
                    // }
                  />
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label>
                    Select number of access route coordinates if no existing
                    track:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    as="select"
                    name="numberOfAccessRoute"
                    value={values.numberOfAccessRoute}
                    onChange={(e) => setRouteNumber(e.target.value)}
                    // isValid={
                    //   touched.numberOfAccessRoute && !errors.numberOfAccessRoute
                    // }
                  >
                    <option value=""></option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )} */}
              <pre>{JSON.stringify(values, 0, 2)}</pre>
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

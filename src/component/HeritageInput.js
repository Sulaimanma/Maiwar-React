import React, { useState } from "react"
import { Form, Col, InputGroup, Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { Formik } from "formik"
import { v4 as uuid } from "uuid"
import * as yup from "yup"

import API, { graphqlOperation } from "@aws-amplify/api"
import { createHeritage } from "../graphql/mutations"
import Storage from "@aws-amplify/storage"

import RingLoader from "react-spinners/RingLoader"

export default function HeritageInput(props) {
  const [videoData, setVideoData] = useState("")
  const [audioData, setAudioData] = useState("")
  const [imageData, setImageData] = useState("")
  const [examined, setExamined] = useState(true)
  const [identified, setIdentified] = useState(true)

  const { latitude, longitude, fetchHeritages, setEnter, loading, setLoading } =
    props

  const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),

    video_file: yup.mixed().optional(),
    image_file: yup.mixed().optional(),
    audio_file: yup.mixed().optional(),
    terms: yup.bool().required().oneOf([true], "terms must be accepted"),
    creator: yup.string().required(),
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
    numberOfAccessRoute: yup
      .string()
      .required("Number of access route is required"),
    accessRouteCoordinate: yup
      .array()
      .of(yup.string().required("Access route is required")),
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
    clearedToProceed: yup.boolean().optional,
    HeritageFieldOfficer: yup.string().required(),
    technicalAdvisor: yup.string().required(),
    coordinator: yup.string().required(),
  })
  const initialValues = {
    surveyDate: "",
    siteNumber: "",
    GPSCoordinates: [],
    routeExaminedOrNot: false,
    examinedRouteLocation: "",
    numberOfAccessRoute: "",
    accessRouteCoordinate: [],
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

  return (
    <div>
      {loading ? (
        <RingLoader />
      ) : (
        <Formik
          validationSchema={schema}
          onSubmit={(values) => AddHeritage(values)}
          initialValues={initialValues}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Col>
                  <Form.Group as={Col} md="4" controlId="validationFormik101">
                    <Form.Label>Survey date:</Form.Label>
                    <Form.Control
                      type="date"
                      name="surveyDate"
                      value={values.surveyDate}
                      onChange={handleChange}
                      isValid={touched.surveyDate && !errors.surveyDate}
                    />
                    <Form.Control.Feedback tooltip>
                      Looks good!
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Col} md="4" controlId="validationFormik102">
                    <Form.Label>Site number: </Form.Label>
                    <Form.Control
                      type="text"
                      name="siteNumber"
                      value={values.siteNumber}
                      onChange={handleChange}
                      isValid={touched.siteNumber && !errors.siteNumber}
                    />

                    <Form.Control.Feedback tooltip>
                      Looks good!
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <p>GPS coordinates of Survey Area:</p>
                <Col>
                  <Form.Group controlId="validationFormik103">
                    <Form.Label>Datum</Form.Label>
                    <Form.Control
                      type="text"
                      name="datum"
                      value={values.datum}
                      onChange={handleChange}
                      isValid={touched.datum && !errors.datum}
                    />

                    <Form.Control.Feedback tooltip>
                      Looks good!
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="validationFormik103">
                    <Form.Label>Easting</Form.Label>
                    <Form.Control
                      type="text"
                      name="easting"
                      value={values.easting}
                      onChange={handleChange}
                      isValid={touched.easting && !errors.easting}
                    />

                    <Form.Control.Feedback tooltip>
                      Looks good!
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="validationFormik103">
                    <Form.Label>Northing</Form.Label>
                    <Form.Control
                      type="text"
                      name="northing"
                      value={values.northing}
                      onChange={handleChange}
                      isValid={touched.northing && !errors.northing}
                    />

                    <Form.Control.Feedback tooltip>
                      Looks good!
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Form.Row>
              <fieldset>
                <Form.Group as={Row}>
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
                <Form.Group controlId="validationFormik101">
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    type="text"
                    name="examinedRouteLocation"
                    value={values.examinedRouteLocation}
                    onChange={handleChange}
                    isValid={
                      touched.examinedRouteLocation &&
                      !errors.examinedRouteLocation
                    }
                  />
                  <Form.Control.Feedback tooltip>
                    Looks good!
                  </Form.Control.Feedback>
                </Form.Group>
              ) : (
                <Form.Group controlId="validationFormik101">
                  <Form.Label>
                    Select number of access route coordinates if no existing
                    track:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    as="select"
                    name="numberOfAccessRoute"
                    value={values.numberOfAccessRoute}
                    onChange={handleChange}
                    isValid={
                      touched.numberOfAccessRoute && !errors.numberOfAccessRoute
                    }
                  >
                    <option value=""></option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback tooltip>
                    Looks good!
                  </Form.Control.Feedback>
                </Form.Group>
              )}
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
        </Formik>
      )}
    </div>
  )
}

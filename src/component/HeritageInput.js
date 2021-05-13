import React, { useState } from "react"
import { Form, Col, InputGroup } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { Formik } from "formik"
import { v4 as uuid } from "uuid"
import * as yup from "yup"

import API, { graphqlOperation } from "@aws-amplify/api"
import { createHeritage } from "../graphql/mutations"
import Storage from "@aws-amplify/storage"

import RingLoader from "react-spinners/RingLoader"

export default function HeritageInput(props) {
  const [videoData, setVideoData] = useState({})
  const [audioData, setAudioData] = useState({})
  const [imageData, setImageData] = useState({})

  const { latitude, longitude, fetchHeritages, setEnter, loading, setLoading } =
    props
  console.log("typeeeee", typeof latitude)
  const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),

    video_file: yup.mixed().optional(),
    image_file: yup.mixed().optional(),
    audio_file: yup.mixed().optional(),
    terms: yup.bool().required().oneOf([true], "terms must be accepted"),
    creator: yup.string().required(),
  })

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
      const Videokey = await Storage.put(`${uuid()}.mp4`, videoData, {
        contentType: "video/mp4",
        level: "public",
      })

      const Audiokey = await Storage.put(`${uuid()}.mp3`, audioData, {
        contentType: "audio/mp3",
      })
      const Imagekey = await Storage.put(`${uuid()}.jpg`, audioData, {
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
          initialValues={{
            title: "",
            description: "",

            video_file: "",
            image_file: "",
            audio_file: "",
            terms: false,
            creator: "",
          }}
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
                <Form.Group as={Col} md="4" controlId="validationFormik101">
                  <Form.Label>title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    isValid={touched.title && !errors.title}
                  />
                  <Form.Control.Feedback tooltip>
                    Looks good!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationFormik102">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    isValid={touched.description && !errors.description}
                  />

                  <Form.Control.Feedback tooltip>
                    Looks good!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationFormik103">
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
                </Form.Group>
              </Form.Row>{" "}
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

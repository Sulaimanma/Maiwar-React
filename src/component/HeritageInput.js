import React from "react"
import { Form, Col, InputGroup } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { Formik } from "formik"
import * as yup from "yup"

export default function HeritageInput() {
  // const schema = yup.object().shape({
  //   firstName: yup.string().required(),
  //   lastName: yup.string().required(),
  //   username: yup.string().required(),
  //   city: yup.string().required(),
  //   state: yup.string().required(),
  //   zip: yup.string().required(),
  //   file: yup.mixed().required(),
  //   terms: yup.bool().required().oneOf([true], "terms must be accepted"),
  // });
  // const templete = {
  //   AudioName: "WeTellStoriesToOurChildren",

  //   description:
  //     "A skilled warrior of some twenty years, is tall, well muscled and fit. Even after three kilometres at a steady pace, his breathing is heavy but even. Many of the First Nations people are great hunters who exploit the ample resources of wallaby and grey kangaroo.",
  //   Icon: "Kangaroo",
  //   id: "055c9321-062c-4191-bf11-4670921e8f57",
  //   latitude: "-27.442031",
  //   longitude: "151.720375",
  //   SceneToLoad: "",
  //   title: "Kangaroo Hunt",
  //   updatedAt: "2021-05-05T05:51:19.958Z",
  //   user: "Admin",
  //   uuid: 2,
  //   VideoName: "Kangaroo_Three_Stream_Fight1",
  // };
  const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),

    video_file: yup.mixed().optional(),
    image_file: yup.mixed().optional(),
    audio_file: yup.mixed().optional(),
    terms: yup.bool().required().oneOf([true], "terms must be accepted"),
    creator: yup.string().required(),
  })

  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        title: "",
        description: "",

        video_file: "",
        image_file: "",
        audio_file: "",
        terms: "",
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
        <Form noValidate onSubmit={handleSubmit}>
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
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
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

              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
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

              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.File
                className="position-relative"
                optional
                name="video_file"
                label="Video"
                onChange={handleChange}
                isInvalid={!!errors.video_file}
                feedback={errors.video_file}
                id="validationFormik107"
                feedbackTooltip
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                className="position-relative"
                optional
                name="audio_file"
                label="Audio"
                onChange={handleChange}
                isInvalid={!!errors.audio_file}
                feedback={errors.audio_file}
                id="validationFormik108"
                feedbackTooltip
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                className="position-relative"
                optional
                name="image_file"
                label="Video"
                onChange={handleChange}
                isInvalid={!!errors.image_file}
                feedback={errors.image_file}
                id="validationFormik109"
                feedbackTooltip
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
          {/* <Form.Group>
            <Form.File
              className="position-relative"
              required
              name="file"
              label="File"
              onChange={handleChange}
              isInvalid={!!errors.file}
              feedback={errors.file}
              id="validationFormik107"
              feedbackTooltip
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
  )
}

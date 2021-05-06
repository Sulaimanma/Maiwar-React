import React from "react";
import { Form, Col, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
import * as yup from "yup";

export default function HeritageInput() {
  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    username: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    file: yup.mixed().required(),
    terms: yup.bool().required().oneOf([true], "terms must be accepted"),
  });
  const templete = {
    AudioName: "WeTellStoriesToOurChildren",

    description:
      "A skilled warrior of some twenty years, is tall, well muscled and fit. Even after three kilometres at a steady pace, his breathing is heavy but even. Many of the First Nations people are great hunters who exploit the ample resources of wallaby and grey kangaroo.",
    Icon: "Kangaroo",
    id: "055c9321-062c-4191-bf11-4670921e8f57",
    latitude: "-27.442031",
    longitude: "151.720375",
    SceneToLoad: "",
    title: "Kangaroo Hunt",
    updatedAt: "2021-05-05T05:51:19.958Z",
    user: "Admin",
    uuid: 2,
    VideoName: "Kangaroo_Three_Stream_Fight1",
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        firstName: "Mark",
        lastName: "Otto",
        username: "",
        city: "",
        state: "",
        zip: "",
        file: null,
        terms: false,
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
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                isValid={touched.firstName && !errors.firstName}
              />
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationFormik102">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                isValid={touched.lastName && !errors.lastName}
              />

              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationFormikUsername2">
              <Form.Label>Username</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.username}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="6" controlId="validationFormik103">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="city"
                value={values.city}
                onChange={handleChange}
                isInvalid={!!errors.city}
              />

              <Form.Control.Feedback type="invalid" tooltip>
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik104">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="State"
                name="state"
                value={values.state}
                onChange={handleChange}
                isInvalid={!!errors.state}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.state}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik105">
              <Form.Label>Zip</Form.Label>
              <Form.Control
                type="text"
                placeholder="Zip"
                name="zip"
                value={values.zip}
                onChange={handleChange}
                isInvalid={!!errors.zip}
              />

              <Form.Control.Feedback type="invalid" tooltip>
                {errors.zip}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Group>
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
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit form
          </Button>
        </Form>
      )}
    </Formik>
  );
}

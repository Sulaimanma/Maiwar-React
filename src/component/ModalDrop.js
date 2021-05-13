import react, { useCallback, useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import Dropzone from "react-dropzone"
import csv from "csv"

export default function ModalDrop(props) {
  const [uploadData, setUploadData] = useState(null)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
    props.CloseFunction(false)
  }
  function convertToArrayOfObjects(data) {
    var keys = data.shift()
    data = data.map(function (row) {
      return keys.reduce(function (obj, key, i) {
        obj[key] = row[i]
        return obj
      }, {})
    })

    return data
  }
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader()

    reader.onabort = () => console.log("file reading was aborted")
    reader.onerror = () => console.log("file reading failed")
    reader.onload = () => {
      // Parse CSV file
      csv.parse(reader.result, (err, data) => {
        console.log(
          "Parsed CSV data: ",
          convertToArrayOfObjects(data).slice(0, 100)
        )
        const cleanData = convertToArrayOfObjects(data).slice(0, 100)
        console.log("Parsed CSV json ", cleanData)
      })
    }

    // read file contents
    acceptedFiles.forEach((file) => reader.readAsBinaryString(file))
  }, [])
  // uploadData && console.log("eid mubarak", uploadData)

  return (
    <>
      <p
        onClick={handleShow}
        style={{ color: "#d1d1d1", marginBottom: "7px", cursor: "pointer" }}
      >
        Upload heritages data
      </p>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Add heritages data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div>
                <section
                  style={{
                    backgroundColor: "##fafafa",
                    height: "200px",
                    borderWidth: "2px",
                    borderRadius: "2px",
                    borderColor: "#eeeeee",
                    borderStyle: "dashed",
                    color: "#bdbdbd",
                  }}
                >
                  <div
                    {...getRootProps()}
                    style={{
                      height: "200px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop your ".csv" file here, or click to select
                      files
                    </p>
                  </div>
                </section>
                <div></div>
              </div>
            )}
          </Dropzone>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

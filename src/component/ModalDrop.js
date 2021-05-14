import react, { useCallback, useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import Dropzone from "react-dropzone"
import csv from "csv"
import { v4 as uuid } from "uuid"
import API, { graphqlOperation } from "@aws-amplify/api"
import { createHeritage } from "../graphql/mutations"

export default function ModalDrop(props) {
  const [uploadData, setUploadData] = useState(null)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
    props.CloseFunction(false)
  }
  const handleUpload = () => {
    setShow(false)
    UploadHeritages(uploadData)
    console.log("Finished Upload")
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
        setUploadData(convertToArrayOfObjects(data))
      })
    }
    // read file contents
    acceptedFiles.forEach((file) => reader.readAsBinaryString(file))
  }, [])

  const UploadHeritages = async (data) => {
    // const Videokey = await Storage.put(`${uuid()}.mp4`, videoData, {
    //   contentType: "video/mp4",
    //   level: "public",
    // })

    // const Audiokey = await Storage.put(`${uuid()}.mp3`, audioData, {
    //   contentType: "audio/mp3",
    // })
    // const Imagekey = await Storage.put(`${uuid()}.jpg`, audioData, {
    //   contentType: "image/png,image/jpeg,image/jpg",
    // })
    try {
      for (let i = 0; i < data.length; i++) {
        var createHeritageInput = {
          id: uuid(),
          title: data[i].title,
          description: data[i].description,
          Icon: data[i].title,
          VideoName: data[i].VideoName,
          AudioName: data[i].AudioName,
          SceneToLoad: "test",
          uuid: 1,
          user: data[i].user,
          latitude: data[i].latitude,
          longitude: data[i].longitude,
          ImageName: data[i].ImageName,
        }

        createHeritageInput &&
          (await API.graphql(
            graphqlOperation(createHeritage, { input: createHeritageInput })
          ))

        console.log("计数", i)
      }
      console.log("donedone")
    } catch (error) {
      console.log("Upload error is", error)
    }

    // data.map(
    //   (req, id) =>{
    //     createHeritageInput = {
    //       id: uuid(),
    //       title: req.title,
    //       description: req.description,
    //       Icon: req.title,
    //       VideoName: req.VideoName,
    //       AudioName: req.AudioName,
    //       SceneToLoad: "test",
    //       uuid: 1,
    //       user: req.creator,
    //       latitude: req.latitude,
    //       longitude: req.longitude,
    //       ImageName: req.ImageName,
    //     }
    //     API.graphql(
    //       graphqlOperation(createHeritage, { input: createHeritageInput }))

    //   }
    // )

    //   fetchHeritages()
    //     .then(() => setLoading(false))
    //     .then(() => setEnter(false))
    //     .then(() => console.log("fetch good boy"))
    // } catch (error) {
    //   console.log("error when uploading is", error)
    // }
  }

  console.log("uploaddataaaaa", uploadData)
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
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

import react, { useCallback, useEffect, useState } from "react"
import { Button, Col, Modal, Row } from "react-bootstrap"
import Dropzone from "react-dropzone"
import csv from "csv"
import { v4 as uuid } from "uuid"
import API, { graphqlOperation } from "@aws-amplify/api"
import { createHeritage } from "../graphql/mutations"
import { AiFillDelete } from "react-icons/ai"
import Storage from "@aws-amplify/storage"
export default function ModalDrop(props) {
  const [uploadData, setUploadData] = useState(null)
  const [show, setShow] = useState(false)
  const [fileList, setFilelist] = useState(null)
  var videoList = []
  const [videosUpload, setVideosUpload] = useState(null)

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
    props.CloseFunction(false)
  }
  const handleUpload = () => {
    setShow(false)
    UploadHeritages(uploadData, videosUpload)
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
  //Drop the heritages information
  const onDropInformation = useCallback((acceptedFiles) => {
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

    acceptedFiles.forEach((file) => {
      reader.readAsBinaryString(file)
      var fileItem = []
      fileItem.push(file.name)
      setFilelist(fileItem)
    })
  }, [])
  //Drop the heritage media
  const onDropMedia = useCallback((acceptedFiles) => {
    console.log("AcceptedFiles", acceptedFiles)
    setVideosUpload(acceptedFiles)

    // acceptedFiles.forEach((file) => {
    //   videoList.push({ file })
    //   console.log("resultttttttttt", videoList)
    //   setVideosUpload(videoList)
    // })
  }, [])

  const UploadHeritages = async (data, videos) => {
    // const Audiokey = await Storage.put(`${uuid()}.mp3`, audioData, {
    //   contentType: "audio/mp3",
    // })
    // const Imagekey = await Storage.put(`${uuid()}.jpg`, audioData, {
    //   contentType: "image/png,image/jpeg,image/jpg",
    // })

    videos.map((video) => {
      Storage.put(`video/${video.path}`, video, {
        contentType: "video/mp4",
        level: "public",
      })
    })
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
      }
    } catch (error) {
      console.log("Upload error is", error)
    }
  }
  const handleVideoDelete = (video) => {
    var videoNameList = []
    videosUpload.map((video) => {
      videoNameList.push(video.path)
    })
    const index = videoNameList.indexOf(video.path)
    setVideosUpload(videosUpload.filter((item, id) => id !== index))
  }

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
          <p style={{ fontWeight: "bold" }}>Upload video</p>
          <Dropzone accept="video/mp4" onDrop={onDropMedia}>
            {({ getRootProps, getInputProps }) => (
              <div>
                <section
                  style={{
                    backgroundColor: "##fafafa",
                    height: "100px",
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
                      height: "100px",
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
          {videosUpload &&
            videosUpload.map((video) => (
              <Row key={video.path}>
                <Col md={10}>{video.path && <p>{video.path}</p>}</Col>
                <Col md={2}>
                  <AiFillDelete
                    style={{ color: "#0d6efd", cursor: "pointer" }}
                    onClick={() => {
                      handleVideoDelete(video)
                    }}
                  />
                </Col>
              </Row>
            ))}
          <p style={{ fontWeight: "bold" }}>Upload heritage form</p>
          <Dropzone onDrop={onDropInformation}>
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
          {fileList && (
            <div>
              <Row>
                <Col md={10}>
                  <p>{fileList}</p>
                </Col>
                <Col md={2}>
                  <AiFillDelete
                    style={{ color: "#0d6efd", cursor: "pointer" }}
                    onClick={() => {
                      setFilelist(null)
                      setUploadData(null)
                    }}
                  />
                </Col>
              </Row>
            </div>
          )}
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

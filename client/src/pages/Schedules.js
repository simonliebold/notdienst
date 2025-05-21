import axios from "axios"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useErrorMessage, useSuccessMessage } from "../contexts/AlertContext"
import Col from "react-bootstrap/esm/Col"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import Badge from "react-bootstrap/esm/Badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faPlus } from "@fortawesome/free-solid-svg-icons"
import Row from "react-bootstrap/esm/Row"
import Modal from "react-bootstrap/esm/Modal"
import Button from "react-bootstrap/esm/Button"
import Form from "react-bootstrap/esm/Form"

const CreateSchedule = ({ showCreateModal, setShowCreateModal }) => {
  const handleSuccess = useSuccessMessage()
  const handleError = useErrorMessage()

  const title = useRef(null)
  const start = useRef(null)
  const end = useRef(null)
  const deadline = useRef(null)

  const createNewSchedule = useCallback(async () => {
    const response = await axios
      .post(process.env.REACT_APP_URL + "schedules", {
        title: title.current.value,
        start: start.current.value,
        end: end.current.value,
        deadline: deadline.current.value,
      })
      .catch(handleError)
    if (!response?.data?.message) return
    handleSuccess(response.data.message)
    setShowCreateModal(false)
  }, [handleError, handleSuccess])

  return (
    <Modal
      show={showCreateModal}
      onHide={(e) => setShowCreateModal(false)}
      backdrop="static"
      keyboard={false}
      fullscreen={"md-down"}
    >
      <Modal.Header closeButton>
        <Modal.Title>Neuen Dienstplan anlegen</Modal.Title>
      </Modal.Header>
      <Form onSubmit={createNewSchedule}>
        <Modal.Body>
          <Row xs={1} className="g-4 mt-0  align-items-stretch">
            <Col className="mt-0">
              <h2 className="fs-6">Titel</h2>
              <Form.Control required ref={title} />
            </Col>
            <Col>
              <h2 className="fs-6">Start</h2>
              <Form.Control required type="date" ref={start} />
            </Col>
            <Col>
              <h2 className="fs-6">Ende</h2>
              <Form.Control required type="date" ref={end} />
            </Col>
            <Col>
              <h2 className="fs-6">Abgabefrist</h2>
              <Form.Control required type="date" ref={deadline} />
            </Col>
            <Col></Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">
            <FontAwesomeIcon className="me-2" icon={faPlus} />
            Neuen Dienstplan anlegen
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

const ScheduleItem = ({ schedule }) => {
  // console.log(schedule)
  return (
    <Col>
      <Card>
        <Card.Body
          as={Link}
          to={"/schedules/" + schedule.id}
          className="text-decoration-none"
        >
          <Badge className="me-2">
            <FontAwesomeIcon icon={faCalendar} className="me-1" />
            {schedule.id}
          </Badge>
          {schedule.title}
        </Card.Body>
      </Card>
    </Col>
  )
}

function Schedules() {
  const [schedules, setSchedules] = useState()

  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleError = useErrorMessage()

  const fetchSchedules = async () => {
    const res = await axios
      .get(process.env.REACT_APP_URL + "schedules")
      .catch(handleError)
    setSchedules(res?.data?.schedules)
  }
  useEffect(() => {
    fetchSchedules()
  }, [])

  return (
    <>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4 mt-0 align-items-stretch">
        {schedules?.map((schedule) => {
          return <ScheduleItem schedule={schedule} key={schedule.title} />
        })}
        <Col>
          <Button onClick={(e) => setShowCreateModal(true)}>
            <FontAwesomeIcon className="me-2" icon={faPlus} />
            Neuen Dienstplan anlegen
          </Button>
          <CreateSchedule
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
          />
        </Col>
      </Row>
    </>
  )
}

export default Schedules

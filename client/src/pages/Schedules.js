import axios from "axios"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useErrorMessage, useSuccessMessage } from "../contexts/AlertContext"

import Select from "react-select"

import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import Row from "react-bootstrap/Row"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faPlus } from "@fortawesome/free-solid-svg-icons"
import MultiSelect from "../components/MultiSelect"

const ScheduleModal = () => {
  const { scheduleId } = useParams()

  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()
  const navigate = useNavigate()

  const [schedule, setSchedule] = useState(null)
  const [allEmployees, setAllEmployees] = useState(null)

  const title = useRef(null)
  const start = useRef(null)
  const end = useRef(null)
  const deadline = useRef(null)
  const employees = useRef(null)

  const fetchEmployees = useCallback(async () => {
    const res = await axios
      .get(process.env.REACT_APP_URL + "employees")
      .catch(handleError)
    setAllEmployees(
      res?.data?.employees?.map((employee) => {
        return { value: employee.id, label: employee.initials }
      })
    )
  }, [])

  const fetchSchedule = useCallback(async () => {
    setSchedule(null)
    const res = await axios
      .get(process.env.REACT_APP_URL + "schedules/" + scheduleId)
      .catch(handleError)

    if (!res?.data?.schedule) return navigate("/schedules")
    setSchedule(res.data.schedule)
    title.current.value = res.data.schedule.title
    start.current.value = res.data.schedule.start
    end.current.value = res.data.schedule.end
    const d = new Date(res.data.schedule.deadline)
    const datetimeLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, -1)
    deadline.current.value = datetimeLocal
  }, [scheduleId, handleError])

  const handleFormSubmit = useCallback(async () => {
    // e.preventDefault()
    const res = await axios
      .put(process.env.REACT_APP_URL + "schedules/" + scheduleId, {
        title: title.current.value,
        start: start.current.value,
        end: end.current.value,
        deadline: deadline.current.value,
      })
      .catch(handleError)
    if (res?.data?.message) {
      handleSuccess(res.data.message)
      navigate("/schedules")
    }
  }, [title, start, end, deadline, handleError, scheduleId])

  useEffect(() => {
    if (scheduleId) {
      fetchSchedule()
      fetchEmployees()
    } else setSchedule(null)
  }, [scheduleId, fetchSchedule])

  return (
    <Modal
      show={scheduleId}
      onHide={(e) => navigate("/schedules")}
      backdrop="static"
      keyboard={false}
      fullscreen={"md-down"}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Badge className="me-2">
            <FontAwesomeIcon icon={faCalendar} className="me-2" />
            {schedule?.id}
          </Badge>{" "}
          {schedule?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row xs={1} className="g-4 mt-0  align-items-stretch">
          <Col className="mt-0">
            <h2 className="fs-6">Titel</h2>
            <Form.Control required ref={title} />
          </Col>
          <Col xs={6}>
            <h2 className="fs-6">Start</h2>
            <Form.Control required type="date" ref={start} />
          </Col>
          <Col xs={6}>
            <h2 className="fs-6">Ende</h2>
            <Form.Control required type="date" ref={end} />
          </Col>
          <Col>
            <h2 className="fs-6">Abgabefrist</h2>
            <Form.Control required type="datetime-local" ref={deadline} />
          </Col>
        </Row>
        <Row xs={1} className="g-4 mt-0  align-items-stretch">
          <Col>
            <h2 className="fs-6">Schichten</h2>
            <MultiSelect
              valueType="shifts"
              objectType="schedules"
              objectId={schedule?.id}
              defaultValues={schedule?.shifts}
            />
          </Col>
          <Col>
            <h2 className="fs-6">Angestellte</h2>
            <MultiSelect
              valueType="employees"
              objectType="schedules"
              objectId={schedule?.id}
              defaultValues={schedule?.employees}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" onClick={handleFormSubmit}>
          Speichern
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

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
  }, [handleError, handleSuccess, setShowCreateModal])

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

  // const { scheduleId } = useParams()
  const handleError = useErrorMessage()

  const fetchSchedules = useCallback(async () => {
    const res = await axios
      .get(process.env.REACT_APP_URL + "schedules")
      .catch(handleError)
    setSchedules(res?.data?.schedules)
  }, [handleError])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

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
          <ScheduleModal />
        </Col>
      </Row>
    </>
  )
}

export default Schedules

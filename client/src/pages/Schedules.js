import axios from "axios"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useErrorMessage, useSuccessMessage } from "../contexts/AlertContext"

import Select from "react-select"

import { DayPicker } from "react-day-picker"

import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import Row from "react-bootstrap/Row"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBriefcase,
  faCalendar,
  faCalendarDays,
  faNetworkWired,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import MultiSelect from "../components/MultiSelect"
import ListGroup from "react-bootstrap/ListGroup"

import WorkCard from "../components/WorkCard"

const ScheduleModal = () => {

  const WorkDatePicker = ({ schedule, works }) => {
    const [show, setShow] = useState(false)
    const [date, setDate] = useState(undefined)
    const [dateWorks, setDateWorks] = useState([])

    const scheduleStart = new Date(schedule?.start)
    const scheduleEnd = new Date(schedule?.end)
    const dateString = date?.toLocaleDateString()

    useEffect(() => {
      if (date) setShow(true)
      setDateWorks(
        works.filter((work) => {
          return (
            new Date(work.start).toLocaleDateString() ===
            date?.toLocaleDateString()
          )
        })
      )
    }, [date])

    useEffect(() => {
      if (!show) setDate(undefined)
    }, [show])

    const DateWorksModal = () => {
      return (
        <Modal
          show={show}
          onHide={(e) => setShow(false)}
          backdrop="static"
          keyboard={false}
          fullscreen={"md-down"}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <Badge className="me-2">
                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                {schedule?.id}
              </Badge>
              <strong> {dateString} </strong>
              {schedule?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {dateWorks.length > 0 &&
              dateWorks.map((work) => (
                <WorkCard key={"work-" + work.id} work={work} />
              ))}
          </Modal.Body>
        </Modal>
      )
    }

    return (
      <>
        <DayPicker
          mode="single"
          selected={date}
          fromDate={scheduleStart}
          toDate={scheduleEnd}
          onSelect={setDate}
        />
        <DateWorksModal />
      </>
    )
  }

  const { scheduleId } = useParams()

  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()
  const navigate = useNavigate()

  const [schedule, setSchedule] = useState([])
  const [works, setWorks] = useState([])

  const title = useRef(null)
  const start = useRef(null)
  const end = useRef(null)
  const deadline = useRef(null)


  const fetchSchedule = useCallback(async () => {
    setSchedule([])
    setWorks([])
    const res = await axios
      .get(process.env.REACT_APP_URL + "schedules/" + scheduleId)
      .catch(handleError)

    if (!res?.data?.schedule) return navigate("/schedules")
    setSchedule(res.data.schedule)
    setWorks(res.data.works)
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

  const generateWorks = useCallback(async () => {
    const res = await axios
      .post(process.env.REACT_APP_URL + "schedules/" + scheduleId + "/create")
      .catch(handleError)

    if (res?.data?.message) {
      handleSuccess(res.data.message)
      fetchSchedule()
    }

    console.log(res)
  }, [handleError, handleSuccess, scheduleId])

  const allocateWorks = useCallback(async () => {
    const res = await axios
      .post(process.env.REACT_APP_URL + "schedules/" + scheduleId + "/allocate")
      .catch(handleError)

    if(res?.data) {
      handleSuccess(res.data.message)
      fetchSchedule()
    }

  })

  useEffect(() => {
    if (scheduleId) {
      fetchSchedule()
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
        <Row xs={1} className="g-4 mt-0 align-items-stretch">
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
          <Col>
            <Button type="submit" onClick={handleFormSubmit}>
              Speichern
            </Button>
          </Col>
          <hr />
          <Col className="mt-0">
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
          <hr />
          <Col className="mt-0">
            <h2 className="fs-6">Dienste</h2>
            {works.length === 0 && (
              <Button
                onClick={generateWorks}
                className="w-100"
                variant="outline-secondary"
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Dienste generieren
              </Button>
            )}
            {works.length !== 0 && (
              <WorkDatePicker schedule={schedule} works={works} />
            )}
            <Button onClick={allocateWorks}>Dienste verteilen</Button>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
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

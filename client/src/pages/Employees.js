import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { useAlertUpdate } from "../contexts/AlertContext"

import Select from "react-select"

import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import ListGroup from "react-bootstrap/ListGroup"
import Alert from "react-bootstrap/Alert"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarDays,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import Button from "react-bootstrap/Button"
import { useAuthUpdate } from "../contexts/AuthContext"
import Placeholder from "react-bootstrap/Placeholder"

const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
}

const WorkCard = ({ work }) => {
  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title className="fs-6 m-0">
            <Badge className="me-2">
              <FontAwesomeIcon icon={faCalendarDays} className="me-1" />
              {work.id}
            </Badge>
            {work.event.title}
          </Card.Title>
        </Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            Beginn: {new Date(work.start).toLocaleString("de-DE", dateOptions)}
          </ListGroup.Item>
          <ListGroup.Item>
            Ende: {new Date(work.end).toLocaleString("de-DE", dateOptions)}
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Col>
  )
}

const EmployeeModal = () => {
  const { employeeInitials } = useParams()

  const addAlert = useAlertUpdate()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)

  const [employee, setEmployee] = useState()
  const [works, setWorks] = useState()

  const [allEmployments, setAllEmployments] = useState()
  const [allJobs, setAllJobs] = useState()

  const [name, setName] = useState()
  const [initials, setInitials] = useState()
  const [employmentId, setEmploymentId] = useState()
  const [jobs, setJobs] = useState()

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const close = () => {
    navigate("/employees")
    setShowModal(false)
  }

  const fetchEmployee = async () => {
    setIsLoading(true)
    setShowModal(true)
    fetchAllEmployments()
    fetchAllJobs()

    try {
      const response = await axios.get(
        "http://localhost:3000/employees/" + employeeInitials
      )
      if (!response.data.employee) return

      setEmployee(response.data.employee)
      setWorks(response.data.employee.works)
      setName(response.data.employee.name)
      setInitials(response.data.employee.initials)
      setEmploymentId(response.data.employee.employmentId)
      setJobs(response.data.employee.jobs.map((job) => job.id))
      setIsButtonLoading(false)
      setIsLoading(false)
    } catch (error) {
      if (error.response.data.error) {
        addAlert(error.response.data.error)
        close()
      }
    }
  }

  const fetchAllEmployments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/employments/")
      if (response.data.employments)
        setAllEmployments(
          response.data.employments.map((employment) => {
            return { value: employment.id, label: employment.title }
          })
        )
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
    }
  }

  const fetchAllJobs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/jobs/")
      if (response.data.jobs)
        setAllJobs(
          response.data.jobs.map((job) => {
            return { value: job.id, label: job.title }
          })
        )
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
    }
  }

  const updateEmployee = async () => {
    setIsButtonLoading(true)
    try {
      const response = await axios.put(
        "http://localhost:3000/employees/" + employeeInitials,
        {
          name: name,
          initials: initials,
          employmentId: employmentId,
          jobs: jobs,
        }
      )
      if (response.data.message) addAlert(response.data.message, "success")
      close()
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
    }
  }

  useEffect(() => {
    if (!employeeInitials) return
    fetchEmployee()
  }, [employeeInitials])

  useEffect(() => {
    if (!employee) return
    const newName = employee.name !== name
    const newInitials = employee.initials !== initials
    const newEmploymentId = employee.employmentId !== employmentId
    const newJobs =
      employee.jobs
        .map((job) => job.id)
        .sort()
        .toString() !== jobs.sort().toString()

    setIsButtonDisabled(!(newName || newInitials || newEmploymentId || newJobs))
  }, [name, initials, employmentId, jobs])

  if (!employee) return
  return (
    <Modal
      show={showModal}
      onHide={close}
      fullscreen={"md-down"}
      className="modal-lg"
    >
      <Modal.Header closeButton>
        {isLoading && (
          <Placeholder
            as={Modal.Title}
            className="d-inline-flex"
            animation="glow"
          >
            <Placeholder as={Badge} className="text-primary me-2">
              <FontAwesomeIcon icon={faUser} className="me-1" />
              MUS
            </Placeholder>
            <Placeholder>Max Mustermann</Placeholder>
          </Placeholder>
        )}
        {!isLoading && (
          <Modal.Title>
            <Badge className="me-2">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              {employee.initials}
            </Badge>{" "}
            {employee.name}
          </Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body>
        <h2 className="fs-6">Name</h2>
        {isLoading && (
          <Placeholder as="p" animation="glow">
            <Placeholder disabled as={Form.Control} />
          </Placeholder>
        )}
        {!isLoading && (
          <Form.Control
            defaultValue={employee.name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <h2 className="fs-6 mt-3">Kürzel</h2>
        {isLoading && (
          <Placeholder as="p" animation="glow">
            <Placeholder disabled as={Form.Control} />
          </Placeholder>
        )}
        {!isLoading && (
          <Form.Control
            defaultValue={employee.initials}
            onChange={(e) => setInitials(e.target.value)}
          />
        )}
        <h2 className="fs-6 mt-3">Anstellungsverhältnis</h2>
        {isLoading && (
          <Placeholder as="p" animation="glow">
            <Placeholder disabled as={Form.Control} />
          </Placeholder>
        )}
        {!isLoading && (
          <Select
            defaultValue={{
              value: employee.employment.id,
              label: employee.employment.title,
            }}
            name="employment"
            options={allEmployments}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(value) => setEmploymentId(value.value)}
          />
        )}
        <h2 className="fs-6 mt-3">Jobs</h2>
        {isLoading && (
          <Placeholder as="p" animation="glow">
            <Placeholder disabled as={Form.Control} />
          </Placeholder>
        )}
        {!isLoading && (
          <Select
            defaultValue={employee.jobs.map((job) => {
              return { value: job.id, label: job.title }
            })}
            isMulti
            name="jobs"
            options={allJobs}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(values) =>
              setJobs(
                values.map((value) => {
                  return value.value
                })
              )
            }
          />
        )}
        {isLoading && (
          <Placeholder as="p" animation="glow">
            <Placeholder.Button className="mt-3">Speichern</Placeholder.Button>
          </Placeholder>
        )}
        {!isLoading && (
          <Button
            className="mt-3"
            onClick={updateEmployee}
            disabled={isButtonDisabled || isButtonLoading}
          >
            {isButtonLoading && "Lädt..."}
            {!isButtonLoading && "Speichern"}
          </Button>
        )}
        <hr />
        <h2 className="fs-6 mt-3">Arbeitsplanung</h2>
        {(isLoading || works.length === 0) && (
          <Alert variant="secondary">Keine aktuellen Schichten gefunden</Alert>
        )}
        <Row className="g-3" xs={1} lg={2}>
          {!isLoading &&
            works.map((work) => {
              return <WorkCard key={"work-" + work.id} work={work} />
            })}
        </Row>
      </Modal.Body>
    </Modal>
  )
}

const EmployeeCard = ({ employee }) => {
  return (
    <Col>
      <Card>
        <Card.Body
          as={Link}
          to={"/employees/" + employee.initials.toLowerCase()}
          className="text-decoration-none"
        >
          <Badge className="me-2">
            <FontAwesomeIcon icon={faUser} className="me-1" />
            {employee.initials}
          </Badge>
          {employee.name}
        </Card.Body>
      </Card>
    </Col>
  )
}

function Employees() {
  const { employeeInitials } = useParams()
  const addAlert = useAlertUpdate()
  const setToken = useAuthUpdate()

  const [employees, setEmployees] = useState([])

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/employees/")
      if (response.data.employees) setEmployees(response.data.employees)
      else addAlert("Keine Mitarbeiter gefunden", "secondary")
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
      if (error.response.status === 403) setToken(undefined)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [employeeInitials])

  return (
    <Row xs={1} md={2} lg={3} xl={4} className="g-4 mt-0">
      {employees.map((employee, i) => {
        return <EmployeeCard key={"employee-" + i} employee={employee} />
      })}
      <Col className="mb-3" as={Link} onClick={(e) => alert("rftgzhuj")}>
        <Card bg="primary" text="light" className="opacity-75">
          <Card.Body>
            <FontAwesomeIcon className="me-2" icon={faPlus} />
            Neuen Mitarbeiter anlegen
          </Card.Body>
        </Card>
      </Col>
      <EmployeeModal />
    </Row>
  )
}

export default Employees

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

const WorkCard = ({ work }) => {
  console.log(work)
  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title className="fs-6 m-0">
            <Badge className="me-2">#{work.id}</Badge>
            {work.event.title}
          </Card.Title>
        </Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            Beginn:{" "}
            {new Date(work.start).toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Col>
  )
}

const EmployeeModal = ({ employeeId }) => {
  const addAlert = useAlertUpdate()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)

  const [employee, setEmployee] = useState()
  const [employments, setEmployments] = useState()
  const [defaultEmployment, setDefaultEmployment] = useState()
  const [jobs, setJobs] = useState()
  const [defaultJobs, setDefaultJobs] = useState()
  const [works, setWorks] = useState()

  const close = () => {
    navigate("/employees")
    setShowModal(false)
  }

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        "http://192.168.178.44:3000/employees/" + employeeId
      )
      console.log(response)
      if (!response.data.employee) return
      if (!response.data.employee.employment) return
      setEmployee(response.data.employee)
      setDefaultEmployment({
        value: response.data.employee.employment.id,
        label: response.data.employee.employment.title,
      })
      setDefaultJobs(
        response.data.employee.jobs.map((job) => {
          return { value: job.id, label: job.title }
        })
      )
      setWorks(response.data.employee.works)
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
    }
  }

  const fetchEmployments = async () => {
    try {
      const response = await axios.get(
        "http://192.168.178.44:3000/employments/"
      )
      if (response.data.employments)
        setEmployments(
          response.data.employments.map((employment) => {
            return { value: employment.id, label: employment.title }
          })
        )
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://192.168.178.44:3000/jobs/")
      if (response.data.jobs)
        setJobs(
          response.data.jobs.map((job) => {
            return { value: job.id, label: job.title }
          })
        )
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
    }
  }

  useEffect(() => {
    setEmployee()
    setDefaultEmployment()
    setDefaultJobs()
    fetchEmployee()
    if (employeeId) setShowModal(true)
  }, [employeeId])

  useEffect(() => {
    fetchEmployments()
    fetchJobs()
  }, [])

  if (!employee) return
  return (
    <Modal
      show={showModal}
      onHide={close}
      fullscreen={"md-down"}
      className="modal-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Badge className="me-2">{employee.initials}</Badge> {employee.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <h2 className="fs-6">Anstellungsverhältnis</h2>
          <Select
            defaultValue={defaultEmployment}
            name="employment"
            options={employments}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </Form.Group>
        <Form.Group>
          <h2 className="fs-6 mt-3">Jobs</h2>
          <Select
            defaultValue={defaultJobs}
            isMulti
            name="jobs"
            options={jobs}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </Form.Group>
        <h2 className="fs-6 mt-3">Arbeitsplanung</h2>
        {works.length === 0 && <Alert variant="secondary">Keine aktuellen Schichten gefunden</Alert>}
        <Row className="g-3" xs={1} lg={2}>
          {works.map((work) => {
            return <WorkCard work={work} />
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
        <Card.Body>
          <Badge className="me-2">{employee.initials}</Badge>
          {employee.name}
        </Card.Body>
        <Card.Body className="border-top">
          <Card.Link as={Link} to={"/employees/" + employee.id}>
            Bearbeiten
          </Card.Link>
        </Card.Body>
      </Card>
    </Col>
  )
}

function Employees() {
  const addAlert = useAlertUpdate()

  const { employeeId } = useParams()

  const [employees, setEmployees] = useState([])

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://192.168.178.44:3000/employees/")
      if (response.data.employees) setEmployees(response.data.employees)
      else addAlert("Keine Mitarbeiter gefunden", "secondary")
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return (
    <Row xs={1} md={2} lg={3} xl={4} className="g-4 mt-0">
      {employees.map((employee, i) => {
        return <EmployeeCard key={"employee-" + i} employee={employee} />
      })}
      <EmployeeModal employeeId={employeeId} />
    </Row>
  )
}

export default Employees

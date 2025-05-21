import axios from "axios"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { useErrorMessage, useSuccessMessage } from "../contexts/AlertContext"

import Select from "react-select"

import QRCode from "react-qr-code"

import Placeholder from "react-bootstrap/Placeholder"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import ListGroup from "react-bootstrap/ListGroup"
import Alert from "react-bootstrap/Alert"
import ButtonToolbar from "react-bootstrap/ButtonToolbar"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarDays,
  faKey,
  faPlus,
  faSave,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

const WorkCard = ({ work }) => {
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }

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

const EmployeeModal = ({ allEmployments, allJobs }) => {
  const { employeeInitials } = useParams()
  const navigate = useNavigate()
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const [showModal, setShowModal] = useState(false)

  const [employee, setEmployee] = useState()
  const [name, setName] = useState()
  const [initials, setInitials] = useState()
  const [employmentId, setEmploymentId] = useState()
  const [jobs, setJobs] = useState()
  const [works, setWorks] = useState()

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const [token, setToken] = useState(false)
  const [isTokenLoading, setIsTokenLoading] = useState(false)

  const close = useCallback(() => {
    navigate("/employees")
    setShowModal(false)
  }, [navigate])

  const fetchEmployee = useCallback(async () => {
    setIsLoading(true)
    setShowModal(true)
    setToken()
    setShowDeleteModal()
    setShowTokenModal()

    const response = await axios
      .get(process.env.REACT_APP_URL + "employees/" + employeeInitials)
      .catch(handleError)

    if (!response?.data?.employee) return close()

    setEmployee(response.data.employee)
    setWorks(response.data.employee.works)
    setName(response.data.employee.name)
    setInitials(response.data.employee.initials)
    setEmploymentId(response.data.employee.employmentId)
    setJobs(response.data.employee.jobs.map((job) => job.id))

    setIsButtonLoading(false)
    setIsLoading(false)
  }, [employeeInitials, handleError])

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setIsButtonLoading(true)
      const response = await axios
        .put(process.env.REACT_APP_URL + "employees/" + employeeInitials, {
          name: name,
          initials: initials,
          employmentId: employmentId,
          jobs: jobs,
        })
        .catch(handleError)
      if (!response?.data?.message) return
      setIsButtonLoading(false)
      handleSuccess(response.data.message)
      close()
    },
    [
      close,
      employeeInitials,
      employmentId,
      handleError,
      handleSuccess,
      initials,
      jobs,
      name,
    ]
  )

  const createToken = useCallback(async () => {
    setIsTokenLoading(true)
    const response = await axios
      .post(
        process.env.REACT_APP_AUTH_URL + "credentials/generate/" + employee.id
      )
      .catch(handleError)
    if (!response?.data?.code && !response?.data?.expiresAt) return
    setToken({
      code: response.data.code,
      expiresAt: response.data.expiresAt,
    })
    setIsTokenLoading(false)
    setShowTokenModal(true)
  }, [employee, handleError])

  const deleteEmployee = useCallback(async () => {
    close()
    const response = await axios
      .delete(process.env.REACT_APP_URL + "employees/" + employee.id)
      .catch(handleError)
    if (!response?.data?.message) return
    handleSuccess(response.data.message)
  }, [close, employee, handleError, handleSuccess])

  useEffect(() => {
    if (!employeeInitials) return
    fetchEmployee()
  }, [employeeInitials, fetchEmployee])

  useEffect(() => {
    if (!employee) return
    const oldName = employee.name === name
    const oldInitials = employee.initials === initials
    const oldEmploymentId = employee.employmentId === employmentId
    const oldJobs =
      employee.jobs
        .map((job) => job.id)
        .sort()
        .toString() === jobs.sort().toString()

    setIsButtonDisabled(oldName && oldInitials && oldEmploymentId && oldJobs)
  }, [name, initials, employmentId, jobs, employee])

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const DeleteModal = () => {
    const [confirm, setConfirm] = useState("")
    return (
      <Modal
        show={showDeleteModal}
        onHide={(e) => setShowDeleteModal(false)}
        backdrop="static"
        keyboard={false}
        fullscreen={"md-down"}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Badge className="me-2">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              {employee.initials}
            </Badge>{" "}
            {employee.name} löschen
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Soll <strong>{employee.name}</strong> wirklich endgültig gelöscht
          werden? <hr />
          Um diese Aktion zu bestätigen, gib bitte{" "}
          <strong>{employee.initials}</strong> in das Eingabefeld ein:
          <Form.Control
            className="mt-3"
            varian="danger"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.toUpperCase())}
          ></Form.Control>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={(e) => setShowDeleteModal(false)}
          >
            Abbrechen
          </Button>
          <Button
            variant="danger"
            disabled={confirm !== employee.initials}
            onClick={(e) => {
              deleteEmployee()
              setShowDeleteModal(false)
            }}
          >
            Endgültig löschen
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const [showTokenModal, setShowTokenModal] = useState(false)
  const TokenModal = () => {
    return (
      token && (
        <Modal
          show={showTokenModal}
          onHide={(e) => setShowTokenModal(false)}
          backdrop="static"
          keyboard={false}
          fullscreen={"md-down"}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <Badge className="me-2">
                <FontAwesomeIcon icon={faKey} className="me-2" />
                {token.code}
              </Badge>{" "}
              Account-Token
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col sm="8">
                Name: {employee.name}
                <br />
                {/* TODO: convert string to variable */}
                <a href={"http://localhost:3001/credentials/" + token.code}>
                  {"http://localhost:3001/credentials/" + token.code}
                </a>
                <hr />
                E-Mail und Passwort können mit diesem Token festgelegt werden.
                <br />
                Bitte scanne den QR-Code oder gehe auf den obenstehenden Link.
              </Col>
              <Col sm="4" className="">
                <QRCode
                  as={Card.Image}
                  className="w-100 m-2"
                  size={150}
                  value={"http://localhost:3001/credentials/" + token.code}
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            Gültig bis: {new Date(token.expiresAt).toLocaleString("de-DE")}
          </Modal.Footer>
        </Modal>
      )
    )
  }

  if (!employee) return
  if (showTokenModal) return <TokenModal />
  if (showDeleteModal) return <DeleteModal />
  return (
    <>
      <Modal
        show={showModal}
        onHide={close}
        fullscreen={"md-down"}
        className="modal-lg"
        backdrop="static"
        keyboard={false}
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
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Row>
              <Col xs={3}>
                <h2 className="fs-6">Kürzel</h2>
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
              </Col>
              <Col>
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
              </Col>
            </Row>
            <h2 className="fs-6 mt-3">Anstellungsverhältnis</h2>
            {isLoading && (
              <Placeholder as="p" animation="glow">
                <Placeholder disabled as={Form.Control} />
              </Placeholder>
            )}
            {!isLoading && (
              <Select
                defaultValue={
                  employee.employment && {
                    value: employee.employment.id,
                    label: employee.employment.title,
                  }
                }
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
            <hr />
            <h2 className="fs-6 mt-3">Arbeitsplanung</h2>
            {(isLoading || works.length === 0) && (
              <Alert variant="secondary">
                Keine aktuellen Schichten gefunden
              </Alert>
            )}
            <Row className="g-3" xs={1} lg={2}>
              {!isLoading &&
                works.map((work) => {
                  return <WorkCard key={"work-" + work.id} work={work} />
                })}
            </Row>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button
              variant="link"
              className="text-secondary"
              onClick={(e) => setShowDeleteModal(true)}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>

            {isLoading && (
              <Placeholder as="p" animation="glow">
                <Placeholder.Button className="me-2">
                  <FontAwesomeIcon className="me-2" icon={faKey} />
                  Lädt...
                </Placeholder.Button>
                <Placeholder.Button>
                  <FontAwesomeIcon className="me-2" icon={faSave} />
                  Lädt...
                </Placeholder.Button>
              </Placeholder>
            )}
            {!isLoading && (
              <ButtonToolbar>
                <Button
                  variant="primary"
                  onClick={createToken}
                  disabled={isTokenLoading}
                  className="me-2"
                >
                  <FontAwesomeIcon className="me-2" icon={faKey} />
                  {isTokenLoading && "Lädt..."}
                  {!isTokenLoading && "Token"}
                </Button>
                <Button
                  type="submit"
                  disabled={isButtonDisabled || isButtonLoading}
                >
                  <FontAwesomeIcon className="me-2" icon={faSave} />
                  {isButtonLoading && "Lädt..."}
                  {!isButtonLoading && "Speichern"}
                </Button>
              </ButtonToolbar>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
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

const CreateEmployee = ({ showCreateModal, setShowCreateModal }) => {
  const handleSuccess = useSuccessMessage()
  const handleError = useErrorMessage()

  const initials = useRef(null)
  const name = useRef(null)

  const createNewEmployee = useCallback(async () => {
    const response = await axios
      .post(process.env.REACT_APP_URL + "employees", {
        initials: initials.current.value,
        name: name.current.value,
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
        <Modal.Title>Neuen Mitarbeiter anlegen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={3}>
            <h2 className="fs-6">Kürzel</h2>
            <Form.Control ref={initials} />
          </Col>
          <Col>
            <h2 className="fs-6">Name</h2>
            <Form.Control ref={name} />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={createNewEmployee}>
          <FontAwesomeIcon className="me-2" icon={faPlus} />
          Neuen Mitarbeiter anlegen
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function Employees() {
  const { employeeInitials } = useParams()

  const handleError = useErrorMessage()

  const [employees, setEmployees] = useState([])

  const [allEmployments, setAllEmployments] = useState()
  const [allJobs, setAllJobs] = useState()

  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchEmployees = useCallback(async () => {
    const response = await axios
      .get(process.env.REACT_APP_URL + "employees/")
      .catch(handleError)
    if (response?.data?.values) setEmployees(response.data.values)
  }, [handleError])

  const fetchAllEmployments = useCallback(async () => {
    const response = await axios
      .get(process.env.REACT_APP_URL + "employments/")
      .catch(handleError)
    if (!response?.data?.employments) return

    setAllEmployments(
      response.data.employments.map((employment) => {
        return { value: employment.id, label: employment.title }
      })
    )
  }, [handleError])

  const fetchAllJobs = useCallback(async () => {
    const response = await axios
      .get(process.env.REACT_APP_URL + "jobs/")
      .catch(handleError)
    if (!response?.data?.jobs) return
    setAllJobs(
      response.data.jobs.map((job) => {
        return { value: job.id, label: job.title }
      })
    )
  }, [handleError])

  useEffect(() => {
    if (employeeInitials) return
    fetchEmployees()
  }, [employeeInitials, fetchEmployees])

  useEffect(() => {
    fetchAllEmployments()
    fetchAllJobs()
  }, [fetchAllEmployments, fetchAllJobs])

  return (
    <Row xs={1} md={2} lg={3} xl={4} className="g-4 mt-0 align-items-stretch">
      {employees.map((employee, i) => {
        return <EmployeeCard key={"employee-" + i} employee={employee} />
      })}
      <Col>
        <Button onClick={(e) => setShowCreateModal(true)}>
          <FontAwesomeIcon className="me-2" icon={faPlus} />
          Neuen Mitarbeiter anlegen
        </Button>
        <CreateEmployee
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
        />
      </Col>

      <EmployeeModal allEmployments={allEmployments} allJobs={allJobs} />
    </Row>
  )
}

export default Employees

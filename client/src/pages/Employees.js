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
import Placeholder from "react-bootstrap/Placeholder"
import FormLabel from "react-bootstrap/esm/FormLabel"

const EmployeeModal = ({ employeeId }) => {
  const addAlert = useAlertUpdate()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)

  const [employee, setEmployee] = useState()
  const [employments, setEmployments] = useState()
  const [defaultEmployment, setDefaultEmployment] = useState()

  const close = () => {
    navigate("/employees")
    setShowModal(false)
  }

  const fetchEmployee = async () => {
    setEmployee()
    try {
      const response = await axios.get(
        "http://localhost:3000/employees/" + employeeId
      )
      if (!response.data.employee) return
      if (!response.data.employee.employment) return
      setEmployee(response.data.employee)
      setDefaultEmployment({
        value: response.data.employee.employment.id,
        label: response.data.employee.employment.title,
      })
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
    }
  }

  const fetchEmployments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/employments/")
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

  // console.log(employments)

  useEffect(() => {
    fetchEmployee()
    fetchEmployments()
    if (employeeId) setShowModal(true)
  }, [employeeId])

  if (!employee) return
  return (
    <Modal show={showModal} onHide={close} fullscreen={"md-down"}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Badge className="me-2">{employee.initials}</Badge> {employee.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormLabel>Anstellungsverhältnis</FormLabel>
        <Select
          defaultValue={defaultEmployment}
          name="employment"
          options={employments}
          className="basic-multi-select"
          classNamePrefix="select"
        />
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
      const response = await axios.get("http://localhost:3000/employees/")
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

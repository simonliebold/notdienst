import React from "react"

import { Link, useParams } from "react-router-dom"

import Breadcrumb from "react-bootstrap/Breadcrumb"

import useResource from "../../hooks/useResource"
import { EmployeeDetailedCard } from "../../components/DetailedCard"

function Employee() {
  const { employeeId } = useParams()
  const employee = useResource("employees/" + employeeId)
  return (
    <>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item as={Link} to="/employees/" href="/employees/">
          Mitarbeiter
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{employee?.short}</Breadcrumb.Item>
      </Breadcrumb>
      <EmployeeDetailedCard employee={employee} className="mt-3" />
    </>
  )
}

export default Employee

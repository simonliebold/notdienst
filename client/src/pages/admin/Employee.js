import React from "react"

import { useParams } from "react-router-dom"

import useResource from "../../hooks/useResource"
import { EmployeeDetailedCard } from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"

function Employee() {
  const { employeeId } = useParams()
  const employee = useResource("employees/" + employeeId)

  return (
    <>
      <Breadcrumb resourceName="employee" resource={employee} />
      <EmployeeDetailedCard
        employee={employee}
        className="mt-3"
      />
    </>
  )
}

export default Employee

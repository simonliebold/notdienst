import React, { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import useResource from "../../hooks/useResource"
import { EmployeeDetailedCard } from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"
import { titles } from "../../variables"

function Employee() {
  const { employeeId } = useParams()
  const getEmployee = useResource("employees/" + employeeId)
  const [employee, setEmployee] = useState(null)

  const refresh = async () => {
    const newEmployee = await getEmployee()
    setEmployee(newEmployee)
  }

  useEffect(() => {
    refresh()
  }, [employeeId])

  // refresh()

  return (
    <>
      <Breadcrumb resourceName="employee" resource={employee} />
      <EmployeeDetailedCard
        employee={employee}
        refresh={refresh}
        className="mt-3"
      />
    </>
  )
}

export default Employee

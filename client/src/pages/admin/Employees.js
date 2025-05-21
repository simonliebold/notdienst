import React from "react"
import useResource from "../../hooks/useResource"
import ResourcesPage from "./ResourcesPage"

function Employees() {
  const [employees] = useResource("employees")

  return (
    <ResourcesPage resources={employees} resourceName="employee" />
  )
}

export default Employees

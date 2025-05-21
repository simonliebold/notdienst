import React from "react"
import useResource from "../../hooks/useResource"
import ResourcesPage from "./ResourcesPage"

function Shifts() {
  const [shifts] = useResource("shifts")

  return (
    <ResourcesPage resources={shifts} resourceName="shift" />
  )
}

export default Shifts

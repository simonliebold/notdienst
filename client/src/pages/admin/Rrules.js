import React from "react"
import useResource from "../../hooks/useResource"
import ResourcesPage from "./ResourcesPage"

function Rrules() {
  const [rrules] = useResource("rrules")

  return (
    <ResourcesPage resources={rrules} resourceName="rrule" />
  )
}

export default Rrules

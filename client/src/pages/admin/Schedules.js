import React from "react"
import useResource from "../../hooks/useResource"
import ResourcesPage from "./ResourcesPage"

function Schedules() {
  const [schedules] = useResource("schedules")

  return (
    <ResourcesPage resources={schedules} resourceName="schedule" />
  )
}

export default Schedules

import React from "react"
import useResource from "../../hooks/useResource"
import ResourcesPage from "./ResourcesPage"

function Missions() {
  const [missions] = useResource("missions")

  return (
    <ResourcesPage resources={missions} resourceName="mission" />
  )
}

export default Missions

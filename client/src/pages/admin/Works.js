import React from "react"
import useResource from "../../hooks/useResource"
import ResourcesPage from "./ResourcesPage"

function Works() {
  const [works] = useResource("works")
  return (
    <ResourcesPage resources={works} resourceName="work" />
  )
}

export default Works

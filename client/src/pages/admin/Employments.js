import React from "react"
import useResource from "../../hooks/useResource"
import ResourcesPage from "./ResourcesPage"

function Employment() {
  const [employments] = useResource("employments")

  return (
    <ResourcesPage resources={employments} resourceName="employment" />
  )
}

export default Employment

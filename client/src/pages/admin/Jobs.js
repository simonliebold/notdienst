import React from "react"
import useResource from "../../hooks/useResource"
import ResourcesPage from "./ResourcesPage"

function Jobs() {
  const [jobs] = useResource("jobs")

  return <ResourcesPage resources={jobs} resourceName="job" />
}

export default Jobs

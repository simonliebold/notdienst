import React from "react"

import { Link, useParams } from "react-router-dom"


import useResource from "../../hooks/useResource"
import { JobDetailedCard } from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"

function Job() {
  const { jobId } = useParams()
  const job = useResource("jobs/" + jobId)
  return (
    <>
      <Breadcrumb resourceName="job" resource={job} />
      <JobDetailedCard job={job} className="mt-3" />
    </>
  )
}

export default Job

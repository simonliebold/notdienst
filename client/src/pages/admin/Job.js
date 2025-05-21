import React from "react"

import { Link, useParams } from "react-router-dom"

import Breadcrumb from "react-bootstrap/Breadcrumb"

import useResource from "../../hooks/useResource"
import { JobDetailedCard } from "../../components/DetailedCard"

function Job() {
  const { jobId } = useParams()
  const job = useResource("jobs/" + jobId)
  return (
    <>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item as={Link} to="/jobs/" href="/jobs/">
          Jobs
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{job?.short}</Breadcrumb.Item>
      </Breadcrumb>
      <JobDetailedCard job={job} className="mt-3" />
    </>
  )
}

export default Job

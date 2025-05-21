import React from "react"

import { Link, useParams } from "react-router-dom"

import Breadcrumb from "react-bootstrap/Breadcrumb"

import useResource from "../../hooks/useResource"
import { EmploymentDetailedCard } from "../../components/DetailedCard"

function Employment() {
  const { employmentId } = useParams()
  const employment = useResource("employments/" + employmentId)
  return (
    <>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item as={Link} to="/employments/" href="/employments/">
          Anstellungsverhältnisse
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{employment?.short}</Breadcrumb.Item>
      </Breadcrumb>
      <EmploymentDetailedCard employment={employment} className="mt-3" />
    </>
  )
}

export default Employment

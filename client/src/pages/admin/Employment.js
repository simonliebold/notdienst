import React from "react"

import { Link, useParams } from "react-router-dom"


import useResource from "../../hooks/useResource"
import { EmploymentDetailedCard } from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"

function Employment() {
  const { employmentId } = useParams()
  const employment = useResource("employments/" + employmentId)
  return (
    <>
      <Breadcrumb resourceName="employment" resource={employment} />
      <EmploymentDetailedCard employment={employment} className="mt-3" />
    </>
  )
}

export default Employment

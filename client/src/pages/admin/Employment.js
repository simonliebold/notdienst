import React, { useEffect, useState } from "react"

import { Link, useParams } from "react-router-dom"

import useResource from "../../hooks/useResource"
import { EmploymentDetailedCard } from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"

function Employment() {
  const { employmentId } = useParams()
  const getEmployment = useResource("employments/" + employmentId)
  const [employment, setEmployment] = useState(null)

  const refresh = async () => {
    const newEmployment = await getEmployment()
    setEmployment(newEmployment)
  }

  useEffect(() => {
    refresh()
  }, [employmentId])
  return (
    <>
      <Breadcrumb resourceName="employment" resource={employment} />
      <EmploymentDetailedCard
        employment={employment}
        refresh={refresh}
        className="mt-3"
      />
    </>
  )
}

export default Employment

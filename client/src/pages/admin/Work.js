import React from "react"

import { useParams } from "react-router-dom"

import useResource from "../../hooks/useResource"
import { WorkDetailedCard } from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"

function Work() {
  const { workId } = useParams()
  const work = useResource("works/" + workId)
  return (
    <>
      <Breadcrumb resourceName="work" resource={work} />
      <WorkDetailedCard work={work} className="mt-3" />
    </>
  )
}

export default Work

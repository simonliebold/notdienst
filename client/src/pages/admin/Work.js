import React from "react"

import { Link, useParams } from "react-router-dom"

import Breadcrumb from "react-bootstrap/Breadcrumb"

import useResource from "../../hooks/useResource"
import { WorkDetailedCard } from "../../components/DetailedCard"

function Work() {
  const { workId } = useParams()
  const work = useResource("works/" + workId)
  return (
    <>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item as={Link} to="/works/" href="/works/">
          Dienste
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{work?.short}</Breadcrumb.Item>
      </Breadcrumb>
      <WorkDetailedCard work={work} className="mt-3" />
    </>
  )
}

export default Work

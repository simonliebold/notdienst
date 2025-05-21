import React from "react"

import { Link, useParams } from "react-router-dom"

import Breadcrumb from "react-bootstrap/Breadcrumb"

import useResource from "../../hooks/useResource"
import { FreetimeDetailedCard } from "../../components/DetailedCard"

function Freetime() {
  const { freetimeId } = useParams()
  const freetime = useResource("freetimes/" + freetimeId)
  return (
    <>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item as={Link} to="/freetimes/" href="/freetimes/">
          Dienstplanwünsche
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{freetime?.short}</Breadcrumb.Item>
      </Breadcrumb>
      <FreetimeDetailedCard freetime={freetime} className="mt-3" />
    </>
  )
}

export default Freetime

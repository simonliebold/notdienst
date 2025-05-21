import React from "react"

import { Link, useParams } from "react-router-dom"

import Breadcrumb from "react-bootstrap/Breadcrumb"

import useResource from "../../hooks/useResource"
import {
  RruleDetailedCard,
  ShiftDetailedCard,
} from "../../components/DetailedCard"

function Rrule() {
  const { rruleId } = useParams()
  const rrule = useResource("rrules/" + rruleId)
  return (
    <>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item as={Link} to="/rrules/" href="/rrules/">
          Rrules
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{rrule?.short}</Breadcrumb.Item>
      </Breadcrumb>
      <RruleDetailedCard rrule={rrule} className="mt-3" />
    </>
  )
}

export default Rrule

import React from "react"

import { Link, useParams } from "react-router-dom"


import useResource from "../../hooks/useResource"
import {
  RruleDetailedCard,
  ShiftDetailedCard,
} from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"

function Rrule() {
  const { rruleId } = useParams()
  const rrule = useResource("rrules/" + rruleId)
  return (
    <>
      <Breadcrumb resourceName="rrule" resource={rrule} />
      <RruleDetailedCard rrule={rrule} className="mt-3" />
    </>
  )
}

export default Rrule

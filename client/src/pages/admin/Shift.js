import React from "react"

import { Link, useParams } from "react-router-dom"

import useResource from "../../hooks/useResource"
import { ShiftDetailedCard } from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"

function Shift() {
  const { shiftId } = useParams()
  const shift = useResource("shifts/" + shiftId)
  return (
    <>
      <Breadcrumb resourceName="shift" resource={shift} />
      <ShiftDetailedCard shift={shift} className="mt-3" />
    </>
  )
}

export default Shift

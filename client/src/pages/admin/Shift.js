import React from "react"

import { Link, useParams } from "react-router-dom"

import Breadcrumb from "react-bootstrap/Breadcrumb"

import useResource from "../../hooks/useResource"
import { ShiftDetailedCard } from "../../components/DetailedCard"

function Shift() {
  const { shiftId } = useParams()
  const shift = useResource("shifts/" + shiftId)
  return (
    <>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item as={Link} to="/shifts/" href="/shifts/">
          Schichten
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{shift?.short}</Breadcrumb.Item>
      </Breadcrumb>
      <ShiftDetailedCard shift={shift} className="mt-3" />
    </>
  )
}

export default Shift

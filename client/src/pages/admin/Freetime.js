import React from "react"

import { Link, useParams } from "react-router-dom"


import useResource from "../../hooks/useResource"
import { FreetimeDetailedCard } from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"

function Freetime() {
  const { freetimeId } = useParams()
  const freetime = useResource("freetimes/" + freetimeId)
  return (
    <>
      <Breadcrumb resourceName="freetime" resource={freetime} />
      <FreetimeDetailedCard freetime={freetime} className="mt-3" />
    </>
  )
}

export default Freetime

import React from "react"

import { Link, useParams } from "react-router-dom"


import useResource from "../../hooks/useResource"
import { ScheduleDetailedCard } from "../../components/DetailedCard"
import Breadcrumb from "../../components/Breadcrumb"

function Schedule() {
  const { scheduleId } = useParams()
  const schedule = useResource("schedules/" + scheduleId)
  return (
    <>
      <Breadcrumb resourceName="schedule" resource={schedule} />
      <ScheduleDetailedCard schedule={schedule} className="mt-3" />
    </>
  )
}

export default Schedule

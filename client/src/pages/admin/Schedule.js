import React from "react"
import { ScheduleDetailedCard } from "../../components/DetailedCard"
import useResource from "../../hooks/useResource"
import { Link, useParams } from "react-router-dom"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import Badge from "../../components/Badge"

function Schedule() {
  const { scheduleId } = useParams()
  const schedule = useResource("schedules/" + scheduleId)
  return (
    <>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item as={Link} to="/schedules/" href="/schedules/">
          Dienstpläne
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{schedule?.short}</Breadcrumb.Item>
      </Breadcrumb>
      <ScheduleDetailedCard schedule={schedule} className="mt-3" />
    </>
  )
}

export default Schedule

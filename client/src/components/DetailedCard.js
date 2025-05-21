import React from "react"
import Card from "react-bootstrap/Card"
import Badge from "./Badge"
import MultiBadge from "./MultiBadge"
import { CardDeleteButton, CardEditButton } from "./CardButton"
import { localeString } from "../variables"

const DetailedCard = ({ resource, resourceName, children }) => {
  const { id, short, title } = resource || {}
  return (
    <Card className="text-decoration-none">
      <Card.Header className="fs-6 m-0">
        <Badge
          resourceName={resourceName}
          resource={resource}
          className="me-2"
        />
        {title}
      </Card.Header>
      <Card.Body>{children}</Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <CardDeleteButton
          resource={resource}
          resourceName={resourceName}
          className="me-auto"
        />
        <CardEditButton resource={resource} resourceName={resourceName} />
      </Card.Footer>
    </Card>
  )
}

export const EmploymentDetailedCard = ({ employment }) => {
  // const { } = employment || {}

  return (
    <DetailedCard resourceName="employment" resource={employment}>
      Minimum: {employment?.minHours}{" "}
      {employment?.minHours === null && "Kein Datum gefunden"}
      <br />
      Maximum: {employment?.maxHours}
    </DetailedCard>
  )
}
export const EmployeeDetailedCard = ({ employee }) => {
  const { employment, works, schedules, jobs, fgvhbj } = employee || {}

  return (
    <DetailedCard resourceName="employee" resource={employee}>
      Anstellungsverhältnis: {employment?.title} <br />
      <Badge resource={employment} resourceName="employment" />
      <hr />
      Dienste:
      <MultiBadge items={works} resourceName="work" />
      <hr />
      Schichtpläne:
      <MultiBadge items={schedules} resourceName="schedule" />
      <hr />
      Jobs:
      <MultiBadge items={jobs} resourceName="job" />
    </DetailedCard>
  )
}
export const ScheduleDetailedCard = ({ schedule }) => {
  const { employees, shifts, works } = schedule || {}

  const start = new Date(schedule?.start).toLocaleString(localeString.country)
  const end = new Date(schedule?.end).toLocaleString(localeString.country)
  const deadline = new Date(schedule?.deadline).toLocaleString(
    localeString.country
  )

  return (
    <DetailedCard resourceName="schedule" resource={schedule}>
      Start: {start && start}
      <br />
      Ende: {end && end}
      <br />
      Deadline: {deadline && deadline}
      <hr />
      Dienste:
      <MultiBadge items={works} resourceName="work" />
      <hr />
      Schichten:
      <MultiBadge items={shifts} resourceName="shift" />
      <hr />
      Mitarbeiter:
      <MultiBadge items={employees} resourceName="employee" />
    </DetailedCard>
  )
}

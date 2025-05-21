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

export const JobDetailedCard = ({ job }) => {
  const { id, employees, shifts } = job || {}

  return (
    <DetailedCard resourceName="job" resource={job}>
      Mitarbeiter:
      <MultiBadge resourceName="employee" items={employees} />
      <hr />
      Schichten:
      <MultiBadge resourceName="shift" items={shifts} />
    </DetailedCard>
  )
}

export const FreetimeDetailedCard = ({ freetime }) => {
  const { date, schedule, employee } = freetime || {}

  return (
    <DetailedCard resourceName="freetime" resource={freetime}>
      Datum: {new Date(date).toLocaleDateString(localeString.country)} <br />
      <hr />
      Mitarbeiter: <br />
      <Badge resource={employee} resourceName="employee" />
      <hr />
      Schichtplan: <br />
      <Badge resource={schedule} resourceName="schedule" />
    </DetailedCard>
  )
}

export const EmploymentDetailedCard = ({ employment }) => {
  const hourString = (hours) => {
    if (hours) {
      if (hours === 1) return "1 Stunde"
      return hours + " Stunden"
    }
    return "Kein Wert gesetzt"
  }

  return (
    <DetailedCard resourceName="employment" resource={employment}>
      Minimum: {hourString(employment?.minHours)}
      <br />
      Maximum: {hourString(employment?.maxHours)}
    </DetailedCard>
  )
}
export const EmployeeDetailedCard = ({ employee }) => {
  const { employment, works, schedules, jobs, fgvhbj } = employee || {}

  return (
    <DetailedCard resourceName="employee" resource={employee}>
      Anstellungsverhältnis: <br />
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

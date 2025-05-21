import React from "react"
import Card from "react-bootstrap/Card"
import Placeholder from "react-bootstrap/Placeholder"
import Badge from "./Badge"
import MultiBadge from "./MultiBadge"
import { CardDeleteButton, CardEditButton } from "./CardButton"
import { localeString } from "../variables"

const DetailedCard = ({ resource, resourceName, children }) => {
  const { id, short, title } = resource || {}

  if (!resource)
    return (
      <Card>
        <Placeholder as={Card.Header} animation="glow">
          <Placeholder bg="secondary" xs={2} size="lg" className="me-2" />
          <Placeholder bg="secondary" xs={5} size="lg" />
        </Placeholder>
        <Placeholder as={Card.Body} animation="glow">
          <Placeholder bg="secondary" xs={4} size="lg" />
        </Placeholder>

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

export const WorkDetailedCard = ({ work }) => {
  const { title, start, end, rrule, schedule, employees } = work || {}

  const startString = new Date(start).toLocaleString(localeString.country)
  const endString = new Date(end).toLocaleString(localeString.country)

  return (
    <DetailedCard resource={work} resourceName="work">
      Start: {startString} <br />
      Ende: {endString}
      <hr />
      Mitarbeiter:
      <MultiBadge items={employees} resourceName="employee" />
      <hr />
      Dienstplan: <br />
      <Badge resource={schedule} resourceName="schedule" />
      <hr />
      Schicht: <br />
      <Badge resource={rrule?.shift} resourceName="shift" />
      {/* <hr />
      Wiederholung: <br />
      <Badge resource={rrule} resourceName="rrule" /> */}
    </DetailedCard>
  )
}

export const ShiftDetailedCard = ({ shift }) => {
  const { schedules, jobs, rrules } = shift || {}

  return (
    <DetailedCard resource={shift} resourceName="shift">
      Jobs:
      <MultiBadge items={jobs} resourceName="job" />
      <hr />
      Schichtpläne:
      <MultiBadge items={schedules} resourceName="schedule" />
      <hr />
      Rrules:
      <MultiBadge items={rrules} resourceName="rrule" />
    </DetailedCard>
  )
}

export const RruleDetailedCard = ({ rrule }) => {
  const { title, content, shift } = rrule || {}

  return (
    <DetailedCard resourceName="rrule" resource={rrule}>
      Inhalt: <code>{content}</code>
      <hr />
      Schicht: <br />
      <Badge resource={shift} resourceName="shift" />
    </DetailedCard>
  )
}

export const JobDetailedCard = ({ job }) => {
  const { employees, shifts } = job || {}

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

import React from "react"
import Card from "react-bootstrap/Card"
import Badge from "./Badge"
import MultiBadge from "./MultiBadge"
import { CardDeleteButton, CardEditButton } from "./CardButton"

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

export const EmployeeDetailedCard = ({ employee }) => {
  const { works, employment } = employee || {}

  return (
    <DetailedCard resourceName="employee" resource={employee}>
      Stunden: {employment.title} <br />
      <Badge resource={employment} resourceName="employment" />
      <hr />
      Dienste:
      <MultiBadge items={works} resourceName="work" />
      {/* <hr /> */}
    </DetailedCard>
  )
}
export const ScheduleDetailedCard = ({ schedule }) => {
  const { employees, shifts, works } = schedule || {}

  const start = new Date(schedule.start).toLocaleString("de-DE") || {}
  const end = new Date(schedule.end).toLocaleString("de-DE") || {}
  const deadline = new Date(schedule.deadline).toLocaleString("de-DE") || {}

  return (
    <DetailedCard resourceName="schedule" resource={schedule}>
      Start: {new Date(start).toLocaleString("de-DE")}
      <br />
      Ende: {end} <br />
      Deadline: {deadline}
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

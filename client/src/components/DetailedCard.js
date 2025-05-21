import React from "react"

import { useNavigate, useParams } from "react-router-dom"

import Card from "react-bootstrap/Card"
import Placeholder from "react-bootstrap/Placeholder"
import CloseButton from "react-bootstrap/CloseButton"
import Spinner from "react-bootstrap/Spinner"

import Badge, { EditableBadge } from "./Badge"
import MultiBadge from "./MultiBadge"
import { CardDeleteButton, CardEditButton, CardSaveButton } from "./CardButton"
import { localeString } from "../variables"

const DetailedCard = ({ resource, resourceName, children, className }) => {
  const { title } = resource || {}
  const { action } = useParams()
  const navigate = useNavigate()

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
          <Placeholder.Button>
            <Spinner
              animation="border"
              role="status"
              size={"sm"}
              className="me-2"
            ></Spinner>
            Lädt...
          </Placeholder.Button>
        </Card.Footer>
      </Card>
    )

  return (
    <Card className={"text-decoration-none " + className}>
      <Card.Header className="fs-6 m-0 d-flex align-items-center justify-content-between">
        <div>
          <Badge
            resourceName={resourceName}
            resource={resource}
            className="me-2"
          />
          {title}
          {action === "edit" && " bearbeiten "}
        </div>
        {action === "edit" && (
          <CloseButton
            onClick={(e) => navigate("/" + resourceName + "/" + resource.id)}
          />
        )}
      </Card.Header>
      <Card.Body>{children}</Card.Body>
      <Card.Footer className="d-flex justify-content-end align-items-center">
        {action === "edit" && (
          <>
            <CardDeleteButton
              resource={resource}
              resourceName={resourceName}
              className="me-auto"
            />
            <CardSaveButton />
          </>
        )}
        {action !== "edit" && (
          <>
            <CardEditButton resource={resource} resourceName={resourceName} />
          </>
        )}
      </Card.Footer>
    </Card>
  )
}

export const WorkDetailedCard = ({ work }) => {
  const { start, end, rrule, schedule, employees } = work || {}

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
      <EditableBadge resource={schedule} resourceName="schedule" />
      <hr />
      Schicht: <br />
      <EditableBadge resource={rrule?.shift} resourceName="shift" />
      <hr />
      Rrule: <br />
      <EditableBadge resource={rrule} resourceName="rrule" />
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
      <EditableBadge resource={shift} resourceName="shift" />
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
      <EditableBadge resource={employee} resourceName="employee" />
      <hr />
      Schichtplan: <br />
      <EditableBadge resource={schedule} resourceName="schedule" />
    </DetailedCard>
  )
}

export const EmploymentDetailedCard = ({ employment }) => {
  const { employees, minHours, maxHours } = employment || {}
  const hourString = (hours) => {
    if (hours) {
      if (hours === 1) return "1 Stunde"
      return hours + " Stunden"
    }
    return "Kein Wert gesetzt"
  }

  return (
    <DetailedCard resourceName="employment" resource={employment}>
      Minimum: {hourString(minHours)}
      <br />
      Maximum: {hourString(maxHours)}
      <hr />
      Mitarbeiter:
      <MultiBadge items={employees} resourceName="employee" />
    </DetailedCard>
  )
}
export const EmployeeDetailedCard = ({ employee }) => {
  const { employment, works, schedules, jobs } = employee || {}

  return (
    <DetailedCard resourceName="employee" resource={employee}>
      Anstellungsverhältnis: <br />
      <EditableBadge resource={employment} resourceName="employment" />
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
export const ScheduleDetailedCard = ({ schedule, className }) => {
  const { employees, shifts, works } = schedule || {}

  const start = new Date(schedule?.start).toLocaleDateString(
    localeString.country
  )
  const end = new Date(schedule?.end).toLocaleDateString(localeString.country)
  const deadline = new Date(schedule?.deadline).toLocaleString(
    localeString.country
  )

  return (
    <DetailedCard
      resourceName="schedule"
      resource={schedule}
      className={className}
    >
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

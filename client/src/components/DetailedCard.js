import React, { useEffect, useState } from "react"

import { Link, useNavigate, useParams } from "react-router-dom"

import Card from "react-bootstrap/Card"
import Placeholder from "react-bootstrap/Placeholder"
import CloseButton from "react-bootstrap/CloseButton"
import Spinner from "react-bootstrap/Spinner"

import Badge, { EditableBadge } from "./Badge"
import MultiBadge from "./MultiBadge"
import { CardDeleteButton, CardEditButton, CardSaveButton } from "./CardButton"
import { labels, localeString } from "../variables"
import EditableText from "./EditableText"
import { useResourceUpdate } from "../hooks/useResource"

const DetailedCard = ({
  resource,
  resourceName,
  children,
  className,
  loading = true,
  onSave,
}) => {
  const { title } = resource || {}
  const { action } = useParams()
  const navigate = useNavigate()

  if (loading)
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
            <CardDeleteButton className="me-auto" />
            <CardSaveButton onClick={onSave} />
          </>
        )}
        {action !== "edit" && (
          <>
            <CardEditButton to="edit" />
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
      <Badge resource={schedule} resourceName="schedule" />
      <hr />
      Schicht: <br />
      <Badge resource={rrule?.shift} resourceName="shift" />
      <hr />
      Rrule: <br />
      <Badge resource={rrule} resourceName="rrule" />
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

export default DetailedCard

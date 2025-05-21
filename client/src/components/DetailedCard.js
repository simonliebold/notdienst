import React from "react"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarDays, faHashtag, faUser } from "@fortawesome/free-solid-svg-icons"

const DetailedCard = ({ resource, resourceName }) => {
  const dateString =
    new Date(work.start).toLocaleString("de-DE", {
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }) +
    " bis " +
    new Date(work.end).toLocaleString("de-DE", {
      hour: "numeric",
      minute: "numeric",
    })

  return (
    <Col>
      <Card
        className="mb-3"
        bg={work?.employees?.length > 0 ? "" : ""}
        text={work?.employees?.length > 0 ? "dark" : "dark"}
      >
        <Card.Header className="fs-6 m-0">
          <Badge className="me-2">
            <FontAwesomeIcon icon={faHashtag} className="me-1" />
            {work.id}
          </Badge>
          {work.event.title}
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center">
            <p className="fs-6 mb-0">Mitarbeiter:</p>
            {work?.employees?.length > 0 &&
              work.employees.map((employee) => {
                return (
                  <Badge key={"badge-" + employee.initials} className="ms-2">
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    {employee.initials}
                  </Badge>
                )
              })}
            {!work?.employees?.length > 0 && (
              <p className="ms-1 mb-0">noch nicht zugeteilt</p>
            )}
          </div>
        </Card.Body>
        <Card.Footer>{dateString}</Card.Footer>
      </Card>
    </Col>
  )
}

export default WorkCard

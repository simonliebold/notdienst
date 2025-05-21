import React from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons'

const WorkCard = ({ work }) => {
    const dateString =
      new Date(work.start).toLocaleString("de-DE", {
        weekday: "long",
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
        <Card>
          <Card.Header className="fs-6 m-0">
            <Badge className="me-2">
              <FontAwesomeIcon icon={faCalendarDays} className="me-1" />
              {work.id}
            </Badge>
            {work.event.title}
          </Card.Header>
          <Card.Body>
            Mitarbeiter:
            {work?.employees &&
              work.employees.map((employee) => {
                return (
                  <Badge className="mx-2">
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    {employee.initials}
                  </Badge>
                )
              })}
          </Card.Body>
          <Card.Footer>{dateString}</Card.Footer>
        </Card>
      </Col>
    )
  }

export default WorkCard
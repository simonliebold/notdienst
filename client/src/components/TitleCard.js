import React from "react"
import Card from "react-bootstrap/Card"
import Placeholder from "react-bootstrap/Placeholder"
import { Link } from "react-router-dom"
import Badge from "./Badge"

function TitleCard({ resource, resourceName, className }) {
  const { id, short, title } = resource || {}

  if (!resource)
    return (
      <Card className={className}>
        <Placeholder as={Card.Body} animation="glow">
          <Placeholder bg="secondary" xs={5} size="lg" />
        </Placeholder>
      </Card>
    )
  return (
    <Card className={className}>
      <Card.Body className="text-decoration-none">
        <Badge
          className="me-2"
          resource={resource}
          resourceName={resourceName}
        />
        {title}
      </Card.Body>
    </Card>
  )
}

export default TitleCard

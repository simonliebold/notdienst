import React from "react"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import Badge from "./Badge"

// TODO: add loading state
function TitleCard({ resource, resourceName, className }) {
  const { id, short, title } = resource || {}

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

import React from "react"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import Badge from "./Badge"

function TitleCard({ resource, resourceName, icon }) {
  const { id, short, title } = resource || {}

  return (
    <Card>
      <Card.Body
        as={Link}
        to={"/" + resourceName + "/" + id}
        className="text-decoration-none"
      >
        <Badge className="me-2" resourceName={resourceName}>
          {short}
        </Badge>
        {title}
      </Card.Body>
    </Card>
  )
}

export default TitleCard

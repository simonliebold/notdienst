import React from "react"
import Card from "react-bootstrap/Card"
import Badge from "./Badge"
import { Link } from "react-router-dom"

const DetailedCard = ({ resource, resourceName }) => {
  const { id, short, title } = resource || {}
  return (
    <Card
      as={Link}
      to={"/" + resourceName + "/" + id}
      className="text-decoration-none"
    >
      <Card.Header className="fs-6 m-0">
        <Badge resourceName={resourceName} className="me-2">
          {short}
        </Badge>
        {title}
      </Card.Header>
      <Card.Body>
        <div className="d-flex align-items-center">
        </div>
      </Card.Body>
      <Card.Footer>
      </Card.Footer>
    </Card>
  )
}

export default DetailedCard

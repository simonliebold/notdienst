import React from "react"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import Badge from "./Badge"
import { Link } from "react-router-dom"
import MultiBadge from "./MultiBadge"

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
      <Card.Footer></Card.Footer>
    </Card>
  )
}

export default DetailedCard

import React from "react"
import Card from "react-bootstrap/Card"
import Badge from "./Badge"
import { Link } from "react-router-dom"
import MultiBadge from "./MultiBadge"

const DetailedCard = ({ resource, resourceName }) => {
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
      <Card.Body>
        <div className="d-flex align-items-center">
          <MultiBadge
            items={[
              { id: 1, short: "LBD" },
              { id: 2, short: "PAP" },
              { id: 3, short: "ESH" },
              { id: 4, short: "EWE" },
              { id: 5, short: "MÜL" },
            ]}
            resourceName="employee"
          />
        </div>
      </Card.Body>
      <Card.Footer></Card.Footer>
    </Card>
  )
}

export default DetailedCard

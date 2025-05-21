import React from "react"
import Card from "react-bootstrap/Card"
import Placeholder from "react-bootstrap/Placeholder"
import { Link } from "react-router-dom"
import Badge from "./Badge"

function TitleCard({ resource, resourceName, className }) {
  const { title } = resource || {}
  // TODO: return a badge for each associated component
  if (!resource)
    return (
      <Card className={className}>
        <Placeholder as={Card.Body} animation="glow">
          <Placeholder bg="secondary" xs={5} size="lg" />
        </Placeholder>
      </Card>
    )
  return (
    <Card
      className={"text-decoration-none "+className}
      as={Link}
      to={"/" + resourceName + "/" + resource?.id}
      href={"/" + resourceName + "/" + resource?.id}
    >
      <Card.Header>
        <Badge
          className="me-2"
          resource={resource}
          resourceName={resourceName}
        />
        {title}
      </Card.Header>
    </Card>
  )
}

export default TitleCard

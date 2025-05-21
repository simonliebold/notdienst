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


export default DetailedCard

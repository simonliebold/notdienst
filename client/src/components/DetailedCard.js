import React, { useEffect, useState } from "react"

import Card from "react-bootstrap/Card"
import Placeholder from "react-bootstrap/Placeholder"
import CloseButton from "react-bootstrap/CloseButton"
import Spinner from "react-bootstrap/Spinner"

import Badge from "./Badge"
import {
  CardDeleteButton,
  CardEditButton,
  CardSaveButton,
  ExpandButton,
} from "./CardButton"
import useDelete from "../hooks/useDelete"
import { ConfirmDeletePopup } from "./Popup"
import useSave from "../hooks/useSave"

export const ConfirmDelete = ({ resource, resourceName }) => {
  const [show, open, close, submit, deleting, input, onInput, disabled] =
    useDelete(resource, resourceName)

  return (
    <>
      <ConfirmDeletePopup
        resource={resource}
        show={show}
        close={close}
        submit={submit}
        disabled={disabled}
        input={input}
        onInput={onInput}
        deleting={deleting}
      />
      <CardDeleteButton onClick={open} />
    </>
  )
}

const DetailedCard = ({
  resource,
  resourceName,
  children,
  className,
  loading = true,
  // input,
  // refreshResource,
  saving = false,
  onSaveRequest,
  edit,
  setEdit,
}) => {
  const { title } = resource || {}

  const [expanded, setExpanded] = useState(true)
  useEffect(() => {
    if (resource?.works?.length === 0) setExpanded(true)
    if (resource?.works && resource?.works?.length !== 0) setExpanded(false)
  }, [resource, resourceName])

  if (loading || saving)
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
            {saving && "Speichert..."}
            {loading && "Aktualisiert..."}
          </Placeholder.Button>
        </Card.Footer>
      </Card>
    )

  return (
    <Card className={"text-decoration-none " + className}>
      <Card.Header
        onClick={(e) => {
          if (resource?.works?.length !== 0) setExpanded(!expanded)
        }}
        className="fs-6 m-0 d-flex align-items-center justify-content-between"
      >
        <div>
          <Badge
            resourceName={resourceName}
            resource={resource}
            className="me-2"
          />
          {title}
          {edit && " bearbeiten "}
        </div>
        {edit && <CloseButton onClick={() => setEdit(false)} />}
        {!edit && resource?.works?.length !== 0 && (
          <ExpandButton expanded={expanded} />
        )}
      </Card.Header>
      {expanded && (
        <>
          <Card.Body>{children}</Card.Body>
          <Card.Footer className="d-flex justify-content-end align-items-center">
            {edit && (
              <>
                <ConfirmDelete
                  resource={resource}
                  resourceName={resourceName}
                />
                <CardSaveButton onClick={onSaveRequest} />
              </>
            )}
            {!edit && (
              <>
                <CardEditButton onClick={() => setEdit(true)} />
              </>
            )}
          </Card.Footer>
        </>
      )}
    </Card>
  )
}

export default DetailedCard

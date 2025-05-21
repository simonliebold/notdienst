import { faPen, faSave, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import Button from "react-bootstrap/esm/Button"
import { useNavigate, Link } from "react-router-dom"

function CardButton({
  className,
  variant,
  icon,
  link,
  resourceName,
  resource,
  children,
}) {
  const navigate = useNavigate()

  const path = "/" + resourceName + "/" + resource?.id + "/" + link

  return (
    <Button
      variant={variant}
      icon={icon}
      className={className}
      as={Link}
      to={path}
      onClick={(e) => navigate(path)}
      disabled={!resource || !resourceName}
    >
      <FontAwesomeIcon icon={icon} className="me-2" />
      {children}
    </Button>
  )
}

export const CardEditButton = ({ resource, resourceName, className }) => {
  return (
    <CardButton
      variant="primary"
      icon={faPen}
      resource={resource}
      resourceName={resourceName}
      link="edit"
    >
      Bearbeiten
    </CardButton>
  )
}

export const CardDeleteButton = ({ resource, resourceName, className }) => {
  return (
    <CardButton
      variant="link"
      className={"text-secondary text-decoration-none " + className}
      icon={faTrash}
      resource={resource}
      resourceName={resourceName}
      link="delete"
    >
      Löschen
    </CardButton>
  )
}

export const CardSaveButton = ({ resource, resourceName, className }) => {
  return (
    <CardButton
      variant="primary"
      icon={faSave}
      resource={resource}
      resourceName={resourceName}
      link=""
    >
      Speichern
    </CardButton>
  )
}

export default CardButton

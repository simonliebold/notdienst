import {
  faCancel,
  faPen,
  faSave,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import Button from "react-bootstrap/esm/Button"
import { Link } from "react-router-dom"
import { title } from "../variables"

function CardButton({ icon, children, ...props }) {
  return (
    <Button {...props}>
      {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
      {children}
    </Button>
  )
}

function CardButtonLink({ to, ...props }) {
  return <CardButton as={Link} to={to} {...props} />
}

export const CardEditButton = ({ ...props }) => {
  return (
    <CardButton icon={faPen} variant="primary" {...props}>
      Bearbeiten
    </CardButton>
  )
}

export const CardDeleteButton = ({ className, ...props }) => {
  return (
    <CardButton
      variant="link"
      icon={faTrash}
      className={"text-decoration-none text-secondary " + className}
      {...props}
    >
      Löschen
    </CardButton>
  )
}

export const CardSaveButton = ({ ...props }) => {
  return (
    <CardButton variant="primary" icon={faSave} {...props}>
      Speichern
    </CardButton>
  )
}

export const ConfirmDeleteButton = ({ resource, resourceName, ...props }) => {
  return (
    <CardButton variant="danger" icon={faTrash} {...props}>
      {/* {title[resourceName] + " " + resource?.title + " löschen"} */}
      Endgültig löschen
    </CardButton>
  )
}

export const CancelButton = ({ ...props }) => {
  return (
    <CardButton variant="link text-decoration-none text-secondary" {...props}>
      {/* {title[resourceName] + " " + resource?.title + " löschen"} */}
      Abbrechen
    </CardButton>
  )
}

export default CardButton

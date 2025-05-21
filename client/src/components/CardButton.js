import { faPen, faSave, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import Button from "react-bootstrap/esm/Button"
import { Link } from "react-router-dom"

function CardButton({ icon, children, ...props }) {
  return (
    <Button {...props}>
      <FontAwesomeIcon icon={icon} className="me-2" />
      {children}
    </Button>
  )
}

function CardButtonLink({ to, ...props }) {
  return <CardButton as={Link} to={to} {...props} />
}

export const CardEditButton = ({ ...props }) => {
  return (
    <CardButtonLink icon={faPen} variant="primary" {...props}>
      Bearbeiten
    </CardButtonLink>
  )
}

export const CardDeleteButton = ({ className, ...props }) => {
  return (
    <CardButtonLink
      variant="link"
      icon={faTrash}
      // to="./../delete"
      className={"text-decoration-none text-secondary " + className}
      {...props}
    >
      Löschen
    </CardButtonLink>
  )
}

export const CardSaveButton = ({ ...props }) => {
  return (
    <CardButton variant="primary" icon={faSave} {...props}>
      Speichern
    </CardButton>
  )
}

export default CardButton

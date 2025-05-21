import React from "react"
import BootstrapBadge from "react-bootstrap/Badge"
import Placeholder from "react-bootstrap/Placeholder"
import { icons, titles } from "./../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faSpinner, faX } from "@fortawesome/free-solid-svg-icons"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Form from "react-bootstrap/Form"

function Badge({ resource, resourceName, disabled, edit, className }) {
  const { id, short } = resource || {}

  const icon = icons[resourceName] || icons.default

  // if (edit) return <Form.Control />

  return (
    <BootstrapBadge
      as={disabled ? BootstrapBadge : Link}
      to={"/" + resourceName + "/" + id}
      className={className + " text-decoration-none w-auto"}
      bg={disabled ? "secondary" : "primary"}
    >
      {/* <FontAwesomeIcon icon={faX} className="me-3" /> */}
      {resource && <FontAwesomeIcon icon={icon} className="me-2" />}
      {short?.toString().toUpperCase()}
    </BootstrapBadge>
  )
}

export default Badge

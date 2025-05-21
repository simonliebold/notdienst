import React from "react"
import BootstrapBadge from "react-bootstrap/Badge"
import Placeholder from "react-bootstrap/Placeholder"
import { icons } from "./../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faSpinner, faX } from "@fortawesome/free-solid-svg-icons"

function Badge({ resource, resourceName, disabled, className }) {
  const { id, short } = resource || {}

  const icon = icons[resourceName] || icons.default

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

import React from "react"
import BootstrapBadge from "react-bootstrap/Badge"
import Placeholder from "react-bootstrap/Placeholder"
import { icons } from "./../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faSpinner, faX } from "@fortawesome/free-solid-svg-icons"

function Badge(props) {
  const { resource, resourceName, className } = props || {}

  const { id, short } = resource || {}

  const icon = icons[resourceName] || icons.default

  return (
    <BootstrapBadge
      as={resourceName ? Link : BootstrapBadge}
      to={"/" + resourceName + "/" + id}
      className={className + " text-decoration-none w-auto"}
      bg={resourceName ? "primary" : "secondary"}
    >
      {/* <FontAwesomeIcon icon={faX} className="me-3" /> */}
      {resource && <FontAwesomeIcon icon={icon} className="me-2" />}
      {short?.toString().toUpperCase()}
    </BootstrapBadge>
  )
}

export default Badge

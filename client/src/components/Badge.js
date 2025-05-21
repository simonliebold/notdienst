import React from "react"
import BootstrapBadge from "react-bootstrap/Badge"
import { icons } from "./../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

function Badge(props) {
  const { resource, resourceName, className } = props

  const { id, short } = resource || {}

  const icon = icons[resourceName] || icons.default

  return (
    <BootstrapBadge
      as={Link}
      to={"/" + resourceName + "/" + id}
      className={className + " text-decoration-none"}
    >
      <FontAwesomeIcon icon={icon} className="me-2" />
      {short}
    </BootstrapBadge>
  )
}

export default Badge

import React from "react"
import BootstrapBadge from "react-bootstrap/Badge"
import { icons } from "./../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Badge(props) {
  const { resource, resourceName } = props

  const {short} = resource || {}

  const icon = icons[resourceName] || icons.default

  return (
    <BootstrapBadge {...props}>
      <FontAwesomeIcon icon={icon} className="me-2" />
      {short}
    </BootstrapBadge>
  )
}

export default Badge

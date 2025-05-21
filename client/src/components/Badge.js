import React from "react"
import BootstrapBadge from "react-bootstrap/Badge"
import { icons } from "./../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Badge(props) {
  const { children, resourceName } = props
  const icon = icons[resourceName] || icons.default

  if(!children) return

  return (
    <BootstrapBadge {...props}>
      <FontAwesomeIcon icon={icon} className="me-2" />
      {children}
    </BootstrapBadge>
  )
}

export default Badge

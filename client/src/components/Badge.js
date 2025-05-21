import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import BootstrapBadge from "react-bootstrap/Badge"

function Badge(props) {
  return (
    <BootstrapBadge {...props}>
      <FontAwesomeIcon icon={props.icon} className="me-1" />
      {props.children}
    </BootstrapBadge>
  )
}

export default Badge

import React from "react"
import { titles } from "../variables"
import { Link } from "react-router-dom"
import Badge from "./Badge"
import BootstrapBreadcrumb from "react-bootstrap/Breadcrumb"

function Breadcrumb({ resourceName, resource }) {
  return (
    <BootstrapBreadcrumb className="mt-3">
      <BootstrapBreadcrumb.Item
        as={Link}
        to={"/" + resourceName + "s/"}
        href={"/" + resourceName + "s/"}
      >
        {titles[resourceName]}
      </BootstrapBreadcrumb.Item>
      <BootstrapBreadcrumb.Item active>
        <Badge resource={resource} resourceName={resourceName} disabled />
      </BootstrapBreadcrumb.Item>
    </BootstrapBreadcrumb>
  )
}

export default Breadcrumb

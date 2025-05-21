import React from "react"
import { icons, title, titles } from "../variables"
import { Link } from "react-router-dom"
import Badge from "./Badge"
import BootstrapBreadcrumb from "react-bootstrap/Breadcrumb"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"

// TODO: fix nesting of anchor tags
function Breadcrumb({ resourceName, resource }) {
  return (
    <>
      <BootstrapBreadcrumb className="mt-3">
        <BootstrapBreadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          <FontAwesomeIcon size="sm" icon={faHome} />
        </BootstrapBreadcrumb.Item>
        <BootstrapBreadcrumb.Item
          linkAs={Link}
          linkProps={{ to: "/" + resourceName + "s" }}
        >
          {titles[resourceName]}
        </BootstrapBreadcrumb.Item>
        <BootstrapBreadcrumb.Item
          linkAs={Link}
          linkProps={{ to: "/" + resourceName + "s/" + resource?.id }}
        >
          {resource && resource?.title}
        </BootstrapBreadcrumb.Item>
      </BootstrapBreadcrumb>
      {/* <hr /> */}
      <h1 className="d-flex align-items-center mb-4">
        {resource && (
          <>
            {title[resourceName]}
            <Badge
              resource={resource}
              resourceName={resourceName}
              className="ms-3"
            />
          </>
        )}

        {!resource && titles[resourceName]}
      </h1>
    </>
  )
}

export default Breadcrumb

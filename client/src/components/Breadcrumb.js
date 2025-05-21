import React from "react"
import { icons, title, titles } from "../variables"
import { Link } from "react-router-dom"
import Badge from "./Badge"
import BootstrapBreadcrumb from "react-bootstrap/Breadcrumb"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"

function Breadcrumb({ resourceName, resource }) {
  return (
    <>
      <BootstrapBreadcrumb className="mt-3">
        <BootstrapBreadcrumb.Item as={Link} to="/" href="/">
          <FontAwesomeIcon size="sm" icon={faHome} />
        </BootstrapBreadcrumb.Item>
        <BootstrapBreadcrumb.Item
          as={Link}
          to={"/" + resourceName + "s/"}
          href={"/" + resourceName + "s/"}
        >
          {titles[resourceName]}
        </BootstrapBreadcrumb.Item>
        <BootstrapBreadcrumb.Item>
          {resource && resource?.title}
          {/* <Badge resource={resource} resourceName={resourceName} /> */}
        </BootstrapBreadcrumb.Item>
      </BootstrapBreadcrumb>
      {/* <hr /> */}
      <h1 className="d-flex align-items-center mb-4">
        {resource && title[resourceName]}
        <Badge
          resource={resource}
          resourceName={resourceName}
          className="ms-2"
        />

        {!resource && (
          <FontAwesomeIcon
            className="me-2"
            size="sm"
            icon={icons[resourceName]}
          />
        )}
        {!resource && titles[resourceName]}
      </h1>
      {/* <hr /> */}
    </>
  )
}

export default Breadcrumb

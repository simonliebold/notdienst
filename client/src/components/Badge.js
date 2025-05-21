import React from "react"
import BootstrapBadge from "react-bootstrap/Badge"
import Placeholder from "react-bootstrap/Placeholder"
import { icons, titles } from "./../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useParams } from "react-router-dom"
import { faSpinner, faX } from "@fortawesome/free-solid-svg-icons"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Form from "react-bootstrap/Form"
import Select from "react-select"
import useResource from "../hooks/useResource"
// import { icons } from "../variables"

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
      {resource && <FontAwesomeIcon icon={icon} className="me-2" />}
      {short?.toString().toUpperCase()}
    </BootstrapBadge>
  )
}

export const EditableBadge = ({ resource, resourceName }) => {
  const { action } = useParams()
  const options = useResource(resourceName + "s")

  if (action === "edit")
    return (
      <Select
        options={options?.map((option) => ({
          label: option.short,
          value: option.id,
          icon: icons[resourceName],
        }))}
        getOptionLabel={(option) => (
          <>
            <FontAwesomeIcon icon={option.icon} className="me-2" />
            {option.label}
          </>
        )}
        defaultValue={{
          label: resource.short,
          value: resource.id,
          icon: icons[resourceName],
        }}
      />
    )

  return <Badge resource={resource} resourceName={resourceName} />
}

export default Badge

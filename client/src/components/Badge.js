import React from "react"
import { Link, useParams } from "react-router-dom"

import Select from "react-select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BootstrapBadge from "react-bootstrap/Badge"

import useResource from "../hooks/useResource"
import { icons } from "./../variables"

function Badge({ resource, resourceName, disabled, className }) {
  const { id, short } = resource || {}
  const { action } = useParams()

  const icon = icons[resourceName] || icons.default

  return (
    <BootstrapBadge
      as={disabled || action === "edit" ? BootstrapBadge : Link}
      to={"/" + resourceName + "/" + id}
      className={className + " text-decoration-none w-auto"}
      bg={disabled || action === "edit" ? "secondary" : "primary"}
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
        placeholder="Keine Daten gefunden"
        noOptionsMessage={() => "Keine weiteren Optionen verfügbar"}
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

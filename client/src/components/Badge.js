import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import Select from "react-select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BootstrapBadge from "react-bootstrap/Badge"

import useResource from "../hooks/useResource"
import { icons, selectStyles, title } from "./../variables"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel"

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

export const EditableBadge = ({
  resource,
  resourceName,
  onInput,
  disabled,
}) => {
  const { action } = useParams()

  const [options, updateOptions] = useResource(resourceName + "s")

  useEffect(() => {
    updateOptions()
  }, [resourceName])

  if (action === "edit" && disabled)
    return (
      <p>
        <label className="w-100">{title[resourceName]}:</label>
        <Badge resource={resource} resourceName={resourceName} disabled />
      </p>
    )
  if (action === "edit")
    return (
      <p>
        <label className="w-100">{title[resourceName]}:</label>
        <Select
          options={options?.map((option) => ({
            icon: icons[resourceName],
            label: option.short,
            value: option.id,
          }))}
          placeholder="Keine Daten"
          noOptionsMessage={() => "Keine Optionen"}
          styles={selectStyles}
          getOptionLabel={(option) => (
            <>
              <FontAwesomeIcon icon={option.icon} className="me-2" />
              {option.label}
            </>
          )}
          defaultValue={{
            label: resource?.short,
            value: resource?.id,
            icon: icons[resourceName],
          }}
          onChange={(item) => onInput(resourceName + "Id", item.value)}
        />
      </p>
    )

  if (!resource)
    return (
      <p>
        <label className="w-100">{title[resourceName]}:</label>
        <Badge resource={{ short: "Keine Daten" }} disabled />
      </p>
    )

  return (
    <p>
      <label className="w-100">{title[resourceName]}:</label>
      <Badge resource={resource} resourceName={resourceName} />
    </p>
  )
}

export default Badge

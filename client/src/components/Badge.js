import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Select from "react-select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BootstrapBadge from "react-bootstrap/Badge"

import useResource from "../hooks/useResource"
import { icons, selectStyles, title } from "./../variables"

function Badge({ resource, resourceName, disabled, className, ...props }) {
  const { _id, short } = resource || {}

  const icon = icons[resourceName] || icons.default

  return (
    <BootstrapBadge
      as={disabled ? BootstrapBadge : Link}
      to={"/" + resourceName + "s/" + _id}
      className={className + " text-decoration-none w-auto text-light"}
      bg={disabled ? "secondary" : "primary"}
      {...props}
    >
      {resource && <FontAwesomeIcon icon={icon} className="me-2" />}
      {short?.toString().toUpperCase()}
    </BootstrapBadge>
  )
}

export const EditableBadge = ({
  resource,
  resourceName,
  customName,
  onInput,
  disabled,
  edit,
  className,
}) => {
  const [options, updateOptions] = useResource(resourceName + "s")
  const [name, setName] = useState(customName)
  useEffect(() => {
    if (customName) setName(customName)
    else setName(resourceName)
  }, [customName, resourceName])

  useEffect(() => {
    updateOptions()
  }, [resourceName, updateOptions])

  if (edit && disabled)
    return (
      <p>
        <label className="w-100">{title[name]}:</label>
        <Badge className="" resource={resource} resourceName={resourceName} disabled />
      </p>
    )
  if (edit)
    return (
      <div className={className}>
        <label className="w-100">{title[name]}:</label>
        <Select
          options={options?.map((option) => ({
            icon: icons[resourceName],
            label: option.short,
            value: option._id,
          }))}
          placeholder="Keine Daten"
          noOptionsMessage={() => "Keine Optionen"}
          styles={selectStyles}
          getOptionLabel={(option) => (
            <>
              <FontAwesomeIcon
                icon={icons[resourceName] || icons.default}
                className="me-2"
              />
              {option.label}
            </>
          )}
          defaultValue={{
            // resourceName: resourceName,
            label: resource?.short,
            value: resource?._id,
          }}
          onChange={(item) => onInput(resourceName + "Id", item.value)}
        />
      </div>
    )

  if (!resource)
    return (
      <p className="mb-0">
        <label className="w-100">{title[name]}:</label>
        <Badge className="" resource={{ short: "Keine Daten" }} disabled />
      </p>
    )

  return (
    <p className="mb-0">
      <label className="w-100">{title[name]}:</label>
      <Badge className="" resource={resource} resourceName={resourceName} />
    </p>
  )
}

export default Badge

import React, { useEffect, useState } from "react"
import Badge from "./Badge"
import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import { useParams } from "react-router-dom"
import Select from "react-select"
import useResource from "../hooks/useResource"
import { icons, selectStyles, title, titles } from "../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function MultiBadge({ items, resourceName, onInput }) {
  const { action } = useParams()

  const [options, updateOptions] = useResource(resourceName + "s")

  useEffect(() => {
    updateOptions()
  }, [resourceName])

  const onChange = (items) => {
    if (onInput)
      onInput(
        resourceName + "Ids",
        items.map((item) => {
          return item.value
        })
      )
  }

  if (action === "edit") {
    return (
      <p>
        <label className="w-100">{titles[resourceName]}:</label>
        <Select
          isMulti
          getOptionLabel={(option) => (
            <>
              <FontAwesomeIcon icon={option.icon} className="me-2" />
              {option.label}
            </>
          )}
          placeholder="Keine Daten"
          noOptionsMessage={() => "Keine Optionen"}
          styles={selectStyles}
          options={options?.map((option) => ({
            icon: icons[resourceName],
            label: option.short,
            value: option.id,
          }))}
          defaultValue={items?.map((item) => ({
            icon: icons[resourceName],
            label: item.short,
            value: item.id,
          }))}
          onChange={onChange}
        />
      </p>
    )
  }
  if (items?.length === 0)
    return (
      <p>
        <label className="w-100">{titles[resourceName]}:</label>
        <Badge resource={{ short: "Keine Daten" }} disabled />
      </p>
    )
  return (
    <p>
      <label className="w-100">{titles[resourceName]}:</label>
      {items?.map((item) => {
        const { short } = item || {}
        return (
          <Badge
            key={short + "-" + "badge"}
            resource={item}
            resourceName={resourceName}
            className="me-1 mb-1"
          />
        )
      })}
    </p>
  )
}

export default MultiBadge

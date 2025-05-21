import React from "react"
import Badge from "./Badge"
import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import { useParams } from "react-router-dom"
import Select from "react-select"
import useResource from "../hooks/useResource"
import { icons, selectStyles } from "../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function MultiBadge({ items, resourceName, onInput }) {
  const { action } = useParams()
  const options = useResource(resourceName + "s")

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
    )
  }
  if (items?.length === 0)
    return (
      <div>
        <Badge resource={{ short: "Keine Daten" }} disabled />
      </div>
    )
  return (
    <div>
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
    </div>
  )
}

export default MultiBadge

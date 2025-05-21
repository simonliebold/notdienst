import React from "react"
import Badge from "./Badge"
import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import { useParams } from "react-router-dom"
import Select from "react-select"
import useResource from "../hooks/useResource"

function MultiBadge({ items, resourceName }) {
  const { action } = useParams()
  console.log(action)
  const options = useResource(resourceName + "s")

  if (action === "edit")
    return (
      <Select
        isMulti
        options={options?.map((option) => ({
          label: option.short,
          value: option.id,
        }))}
        defaultValue={items?.map((item) => ({
          label: item.short,
          value: item.id,
        }))}
      />
    )
  if (items?.length === 0)
    return (
      <div>
        <Badge resource={{ short: "Keine Daten gefunden" }} disabled />
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

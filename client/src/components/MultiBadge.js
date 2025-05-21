import React from "react"
import Badge from "./Badge"
import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"

function MultiBadge({ items, resourceName }) {
  if (items?.length === 0)
    return (
      <div>
        <Badge resource={{ short: "Keine Daten gefunden" }} disabled> </Badge>
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

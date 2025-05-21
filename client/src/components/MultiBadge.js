import React from "react"
import Badge from "./Badge"

function MultiBadge({ items, resourceName }) {
  return (
    <div>
      {items.map((item) => {
        const { short } = item || {}
        return (
          <Badge
            key={short + "-" + "badge"}
            resource={item}
            resourceName={resourceName}
            className="me-1"
          />
        )
      })}
    </div>
  )
}

export default MultiBadge

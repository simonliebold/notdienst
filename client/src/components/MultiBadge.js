import React from "react"
import Badge from "./Badge"

function MultiBadge({ items, resourceName }) {
  return (
    <>
      {items.map((item) => {
        const { short } = item || {}
        return (
          <Badge
            key={short + "-" + "badge"}
            resource={item}
            resourceName="employee"
            className="me-2 text-decoration-none"
          />
        )
      })}
    </>
  )
}

export default MultiBadge

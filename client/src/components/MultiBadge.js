import React from "react"
import Badge from "./Badge"
import Row from "react-bootstrap/Row"
import Container from "react-bootstrap/Container"

function MultiBadge({ items, resourceName }) {
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

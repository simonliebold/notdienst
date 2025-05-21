import React from "react"
import TitleCard from "./TitleCard"

function MultiTitleCard({ resources, resourceName }) {
  return resources?.map((resource) => {
    return (
      <TitleCard
        key={resourceName + "-titlecard-" + resource.id}
        resource={resource}
        resourceName={resourceName}
        className="mb-2"
      />
    )
  })
}

export default MultiTitleCard

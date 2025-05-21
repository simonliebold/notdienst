import React from "react"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"
import TitleCard from "../../components/TitleCard"

function ResourcesPage({ resourceName, resources }) {
  return (
    <>
      <Breadcrumb resourceName={resourceName} />
      <CardList className="mt-2">
        {resources?.map((resource) => {
          return (
            <TitleCard
              key={"resource-titlecard-" + resource.id}
              resource={resource}
              resourceName={resourceName}
            />
          )
        })}
      </CardList>
    </>
  )
}

export default ResourcesPage

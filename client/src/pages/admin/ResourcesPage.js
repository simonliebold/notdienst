import React, { useCallback, useState } from "react"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"
import TitleCard from "../../components/TitleCard"
import { CreateNewPopup } from "../../components/Popup"
import { CreateNewButton } from "../../components/CardButton"

function ResourcesPage({ resourceName, resources }) {
  const [showCreateNewPopup, setShowCreateNewPopup] = useState(false)

  const onRequestClose = useCallback(() => {
    setShowCreateNewPopup(false)
  }, [setShowCreateNewPopup])

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
        <CreateNewButton
          onClick={(e) => setShowCreateNewPopup(!showCreateNewPopup)}
          resourceName={resourceName}
          className="mt-2"
        />
      <CreateNewPopup onClose={onRequestClose} resourceName={resourceName} show={showCreateNewPopup} />
    </>
  )
}

export default ResourcesPage

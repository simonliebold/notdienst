import React from "react"
import useResource from "../../hooks/useResource"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Missions() {
  const [missions] = useResource("missions")

  return (
    <>
      <Breadcrumb resourceName="mission" />
      <CardList className="mt-2">
        {missions?.map((mission) => {
          return (
            <TitleCard
              key={"mission-titlecard-" + mission.id}
              resource={mission}
              resourceName="mission"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Missions

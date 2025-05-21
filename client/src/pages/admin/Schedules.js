import React from "react"
import useResource from "../../hooks/useResource"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Schedules() {
  const [schedules] = useResource("schedules")

  return (
    <>
      <Breadcrumb resourceName="schedule" />
      <CardList className="mt-2">
        {schedules?.map((schedule) => {
          return (
            <TitleCard
              key={"schedule-titlecard-" + schedule.id}
              resource={schedule}
              resourceName="schedule"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Schedules

import React from "react"
import useResource from "../../hooks/useResource"
import { RruleDetailedCard, ScheduleDetailedCard } from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"

function Schedules() {
  const schedules = useResource("schedules")

  return (
    <>
      <CardList className="mt-2">
        {schedules?.map((schedule) => {
          // return <ScheduleDetailedCard key={"schedule-" + schedule.id} schedule={schedule} />
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

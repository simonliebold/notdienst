import React, { useEffect, useState } from "react"
import useResource from "../../hooks/useResource"
import { RruleDetailedCard, ScheduleDetailedCard } from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Schedules() {
  const getSchedules = useResource("schedules")
  const [schedules, setSchedules] = useState(null)
  useEffect(() => {
    const refresh = async () => {
      setSchedules(await getSchedules())
    }
    refresh()
  }, [])

  return (
    <>
    <Breadcrumb resourceName="schedule" />
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

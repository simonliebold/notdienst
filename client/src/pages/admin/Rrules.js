import React from "react"
import useResource from "../../hooks/useResource"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Rrules() {
  const [rrules] = useResource("rrules")

  return (
    <>
      <Breadcrumb resourceName="rrule" />
      <CardList className="mt-2">
        {rrules?.map((rrule) => {
          return (
            <TitleCard
              key={"rrule-titlecard-" + rrule.id}
              resource={rrule}
              resourceName="rrule"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Rrules

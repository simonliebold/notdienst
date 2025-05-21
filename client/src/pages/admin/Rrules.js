import React from "react"
import useResource from "../../hooks/useResource"
import { RruleDetailedCard } from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"

function Rrules() {
  const rrules = useResource("rrules")

  return (
    <>
      <CardList className="mt-2">
        {rrules?.map((rrule) => {
          // return <RruleDetailedCard key={"rrule-" + rrule.id} rrule={rrule} />
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

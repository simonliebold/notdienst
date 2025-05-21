import React from "react"
import useResource from "../../hooks/useResource"
import { EmployeeDetailedCard, EmploymentDetailedCard, WorkDetailedCard } from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"

function Freetimes() {
  const freetimes = useResource("freetimes")

  return (
    <>
      <CardList className="mt-2">
        {freetimes?.map((freetime) => {
            // return <EmploymentDetailedCard key={"employment-" + employment.id} employment={employment} />
          return (
            <TitleCard
              key={"freetime-titlecard-" + freetime.id}
              resource={freetime}
              resourceName="freetime"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Freetimes

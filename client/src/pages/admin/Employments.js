import React from "react"
import useResource from "../../hooks/useResource"
import { EmployeeDetailedCard, EmploymentDetailedCard, WorkDetailedCard } from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"

function Employment() {
  const employments = useResource("employments")

  return (
    <>
      <CardList className="mt-2">
        {employments?.map((employment) => {
            // return <EmploymentDetailedCard key={"employment-" + employment.id} employment={employment} />
          return (
            <TitleCard
              key={"employee-titlecard-" + employment.id}
              resource={employment}
              resourceName="work"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Employment

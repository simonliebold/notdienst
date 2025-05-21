import React from "react"
import useResource from "../../hooks/useResource"
import { WorkDetailedCard } from "../../components/DetailedCard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { icons } from "../../variables"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"

function Works() {
  const works = useResource("works")
  //   console.log(works)

  return (
    <>
      <h1>Dienste</h1>
      <CardList>
        {works?.map((work) => {
          return <WorkDetailedCard key={"work-" + work.id} work={work} />
          return (
            <TitleCard
              key={"work-" + work.id}
              resource={work}
              resourceName="work"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Works

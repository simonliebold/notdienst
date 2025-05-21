import React from "react"
import useResource from "../../hooks/useResource"
import { WorkDetailedCard } from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Works() {
  const works = useResource("works")

  return (
    <>
      <Breadcrumb resourceName="work" />
      <CardList className="mt-2">
        {works?.map((work) => {
          //   return <WorkDetailedCard key={"work-" + work.id} work={work} />
          return (
            <TitleCard
              key={"work-titlecard-" + work.id}
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

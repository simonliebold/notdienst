import React from "react"
import useResource from "../../hooks/useResource"
import { WorkDetailedCard } from "../../components/DetailedCard"

function Works() {
  const works = useResource("works")
  //   console.log(works)

  return (
    <>
      {works?.map((work) => {
        return <WorkDetailedCard key={"work-" + work.id} work={work} />
      })}
    </>
  )
}

export default Works

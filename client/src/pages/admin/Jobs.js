import React from "react"
import useResource from "../../hooks/useResource"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Jobs() {
  const [jobs] = useResource("jobs")

  return (
    <>
      <Breadcrumb resourceName="job" />
      <CardList className="mt-2">
        {jobs?.map((job) => {
          return (
            <TitleCard
              key={"job-titlecard-" + job.id}
              resource={job}
              resourceName="job"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Jobs

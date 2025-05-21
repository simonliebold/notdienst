import React from "react"
import useResource from "../../hooks/useResource"
import {
  EmployeeDetailedCard,
  EmploymentDetailedCard,
  FreetimeDetailedCard,
  JobDetailedCard,
  WorkDetailedCard,
} from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"

function Jobs() {
  const jobs = useResource("jobs")

  return (
    <>
      <CardList className="mt-2">
        {jobs?.map((job) => {
          // return <JobDetailedCard key={"job-" + job.id} job={job} />
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

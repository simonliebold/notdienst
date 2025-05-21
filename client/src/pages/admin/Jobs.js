import React, { useEffect, useState } from "react"
import useResource from "../../hooks/useResource"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Jobs() {
  const getJobs = useResource("jobs")

  const [jobs, setJobs] = useState(null)

  useEffect(() => {
    const refresh = async () => {
      setJobs(await getJobs())
    }
    refresh()
  }, [])

  return (
    <>
      <Breadcrumb resourceName="job" />
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

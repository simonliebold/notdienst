import React, { useEffect, useState } from "react"
import useResource from "../../hooks/useResource"
import { EmployeeDetailedCard, EmploymentDetailedCard, WorkDetailedCard } from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Employment() {
  const getEmployments = useResource("employments")

  const [employments, setEmployments] = useState(null)

  useEffect(() => {
    const refresh = async () => {
      setEmployments(await getEmployments())
    }
    refresh()
  }, [])

  return (
    <>
    <Breadcrumb resourceName="employment" />
      <CardList className="mt-2">
        {employments?.map((employment) => {
            // return <EmploymentDetailedCard key={"employment-" + employment.id} employment={employment} />
          return (
            <TitleCard
              key={"employment-titlecard-" + employment.id}
              resource={employment}
              resourceName="employment"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Employment

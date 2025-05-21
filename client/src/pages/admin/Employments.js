import React, { useEffect, useState } from "react"
import useResource from "../../hooks/useResource"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Employment() {
  const [employments] = useResource("employments")

  return (
    <>
      <Breadcrumb resourceName="employment" />
      <CardList className="mt-2">
        {employments?.map((employment) => {
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

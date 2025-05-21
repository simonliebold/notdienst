import React from "react"
import useResource from "../../hooks/useResource"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Freetimes() {
  const [freetimes] = useResource("freetimes")

  return (
    <>
      <Breadcrumb resourceName="freetime" />
      <CardList className="mt-2">
        {freetimes?.map((freetime) => {
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

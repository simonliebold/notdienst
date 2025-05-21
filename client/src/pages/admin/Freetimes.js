import React, { useEffect, useState } from "react"
import useResource from "../../hooks/useResource"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Freetimes() {
  const getFreetimes = useResource("freetimes")
  const [freetimes, setFreetimes] = useState(null)

  useEffect(() => {
    const refresh = async () => {
      setFreetimes(await getFreetimes())
    }
    refresh()
  }, [])

  return (
    <>
      <Breadcrumb resourceName="freetime" />
      <CardList className="mt-2">
        {freetimes?.map((freetime) => {
          // return <FreetimeDetailedCard key={"freetime-" + freetime.id} freetime={freetime} />
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

import React, { useEffect, useState } from "react"
import useResource from "../../hooks/useResource"
import { RruleDetailedCard } from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Rrules() {
  const getRrules = useResource("rrules")
  const [rrules, setRrules] = useState(null)
  useEffect(() => {
    const refresh = async () => {
      setRrules(await getRrules())
    }
    refresh()
  }, [])

  return (
    <>
    <Breadcrumb resourceName="rrule" />
      <CardList className="mt-2">
        {rrules?.map((rrule) => {
          // return <RruleDetailedCard key={"rrule-" + rrule.id} rrule={rrule} />
          return (
            <TitleCard
              key={"rrule-titlecard-" + rrule.id}
              resource={rrule}
              resourceName="rrule"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Rrules

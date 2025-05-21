import React from "react"
import useResource from "../../hooks/useResource"
import {
  RruleDetailedCard,
  ShiftDetailedCard,
} from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"

function Shifts() {
  const shifts = useResource("shifts")

  return (
    <>
      <Breadcrumb resourceName="shift" />
      <CardList className="mt-2">
        {shifts?.map((shift) => {
          // return <ShiftDetailedCard key={"shift-" + shift.id} shift={shift} />
          return (
            <TitleCard
              key={"shift-titlecard-" + shift.id}
              resource={shift}
              resourceName="shift"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Shifts

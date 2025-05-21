import React from "react"
import useResource from "../../hooks/useResource"
import { EmployeeDetailedCard, WorkDetailedCard } from "../../components/DetailedCard"
import TitleCard from "../../components/TitleCard"
import CardList from "../../components/CardList"

function Employees() {
  const employees = useResource("employees")

  return (
    <>
      <CardList className="mt-2">
        {employees?.map((employee) => {
            // return <EmployeeDetailedCard key={"employee-" + employee.id} employee={employee} />
          return (
            <TitleCard
              key={"employee-titlecard-" + employee.id}
              resource={employee}
              resourceName="work"
            />
          )
        })}
      </CardList>
    </>
  )
}

export default Employees

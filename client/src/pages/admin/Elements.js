import React from "react"
import Badge from "../../components/Badge"
import { faHashtag, faUser } from "@fortawesome/free-solid-svg-icons"
import TitleCard from "../../components/TitleCard"
import DetailedCard, {
  EmployeeDetailedCard,
  EmploymentDetailedCard,
  FreetimeDetailedCard,
  JobDetailedCard,
  ScheduleDetailedCard,
} from "../../components/DetailedCard"
import MultiBadge from "../../components/MultiBadge"
import useResource from "../../hooks/useResource"

function Elements() {
  const employee = useResource(process.env.REACT_APP_URL + "employees/1")
  const schedule = useResource(process.env.REACT_APP_URL + "schedules/1")
  const employment = useResource(process.env.REACT_APP_URL + "employments/1")
  const freetime = useResource(process.env.REACT_APP_URL + "freetimes/1")
  const job = useResource(process.env.REACT_APP_URL + "jobs/1")
  return (
    <>
      <h2>Badge</h2>
      <Badge resource={{ id: 201, short: 201 }} className="" />
      <hr />
      <h2>TitleCard</h2>
      <TitleCard
        resource={{ id: 256, short: "OKT 23", title: "Oktober 2023" }}
        resourceName={"schedule"}
      />
      <hr />
      <h2>JobDetailedCard</h2>
      <JobDetailedCard job={job} />
      <hr />
      <h2>FreetimeDetailedCard</h2>
      <FreetimeDetailedCard freetime={freetime} />
      <hr />
      <h2>EmploymentDetailedCard</h2>
      <EmploymentDetailedCard employment={employment} />
      <hr />
      <h2>EmployeeDetailedCard</h2>
      <EmployeeDetailedCard employee={employee} />
      <hr />
      <h2>ScheduleDetailedCard</h2>
      <ScheduleDetailedCard schedule={schedule} />{" "}
    </>
  )
}

export default Elements

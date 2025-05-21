import React from "react"
import TitleCard from "../../components/TitleCard"
import {
  EmployeeDetailedCard,
  EmploymentDetailedCard,
  FreetimeDetailedCard,
  JobDetailedCard,
  RruleDetailedCard,
  ScheduleDetailedCard,
  ShiftDetailedCard,
  WorkDetailedCard,
} from "../../components/DetailedCard"
import useResource from "../../hooks/useResource"

function Elements() {
  const employee = useResource("employees/1")
  const schedule = useResource("schedules/1")
  const employment = useResource("employments/1")
  const freetime = useResource("freetimes/1")
  const job = useResource("jobs/1")
  const rrule = useResource("rrules/1")
  const shift = useResource("shifts/1")
  const work = useResource("works/1")
  return (
    <>
      <h1 className="mt-3">Elements</h1>
      <h2>Work</h2>
      <TitleCard resource={work} resourceName="work" className="mb-3" />
      <WorkDetailedCard work={work} />
      <hr />
      <h2>Shift</h2>
      <TitleCard resource={shift} resourceName="shift" className="mb-3" />
      <ShiftDetailedCard shift={shift} />
      <hr />
      <h2>Rrule</h2>
      <TitleCard resource={rrule} resourceName="rrule" className="mb-3" />
      <RruleDetailedCard rrule={rrule} />
      <hr />
      <h2>Job</h2>
      <TitleCard resource={job} resourceName="job" className="mb-3" />
      <JobDetailedCard job={job} />
      <hr />
      <h2>Freetime</h2>
      <TitleCard resource={freetime} resourceName="freetime" className="mb-3" />
      <FreetimeDetailedCard freetime={freetime} />
      <hr />
      <h2>Employment</h2>
      <TitleCard
        resource={employment}
        resourceName="employment"
        className="mb-3"
      />
      <EmploymentDetailedCard employment={employment} />
      <hr />
      <h2>Employee</h2>
      <TitleCard resource={employee} resourceName="employee" className="mb-3" />
      <EmployeeDetailedCard employee={employee} />
      <hr />
      <h2>Schedule</h2>
      <TitleCard resource={schedule} resourceName="schedule" className="mb-3" />
      <ScheduleDetailedCard schedule={schedule} />{" "}
    </>
  )
}

export default Elements

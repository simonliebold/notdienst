import React, { useCallback, useState } from "react"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"
import TitleCard from "../../components/TitleCard"
import { CreateNewPopup } from "../../components/Popup"
import { CreateNewButton } from "../../components/CardButton"
import useResource from "../../hooks/useResource"

function ResourcesPage({ resourceName, resources }) {
  const [showCreateNewPopup, setShowCreateNewPopup] = useState(false)

  const onRequestClose = useCallback(() => {
    setShowCreateNewPopup(false)
  }, [setShowCreateNewPopup])

  return (
    <>
      <Breadcrumb resourceName={resourceName} />
      <CardList className="mt-2">
        {resources?.map((resource) => {
          return (
            <TitleCard
              key={"resource-titlecard-" + resource.id}
              resource={resource}
              resourceName={resourceName}
            />
          )
        })}
      </CardList>
      <CreateNewButton
        onClick={(e) => setShowCreateNewPopup(!showCreateNewPopup)}
        resourceName={resourceName}
        className="mt-2"
      />
      <CreateNewPopup
        onClose={onRequestClose}
        resourceName={resourceName}
        show={showCreateNewPopup}
      />
    </>
  )
}

export const EmployeesPage = () => {
  const [employees] = useResource("employees")

  return <ResourcesPage resources={employees} resourceName="employee" />
}

export function EmploymentsPage() {
  const [employments] = useResource("employments")

  return <ResourcesPage resources={employments} resourceName="employment" />
}

export const FreetimesPage = () => {
  const [freetimes] = useResource("freetimes")

  return <ResourcesPage resources={freetimes} resourceName="freetime" />
}

export function JobsPage() {
  const [jobs] = useResource("jobs")

  return <ResourcesPage resources={jobs} resourceName="job" />
}

export function MissionsPage() {
  const [missions] = useResource("missions")

  return (
    <ResourcesPage resources={missions} resourceName="mission" />
  )
}

export function RrulesPage() {
  const [rrules] = useResource("rrules")

  return (
    <ResourcesPage resources={rrules} resourceName="rrule" />
  )
}

export function SchedulesPage() {
  const [schedules] = useResource("schedules")

  return (
    <ResourcesPage resources={schedules} resourceName="schedule" />
  )
}

export function ShiftsPage() {
  const [shifts] = useResource("shifts")

  return (
    <ResourcesPage resources={shifts} resourceName="shift" />
  )
}

export function WorksPage() {
  const [works] = useResource("works")
  return (
    <ResourcesPage resources={works} resourceName="work" />
  )
}

export default ResourcesPage

import React, { useCallback, useState } from "react"
import CardList from "../../components/CardList"
import Breadcrumb from "../../components/Breadcrumb"
import TitleCard from "../../components/TitleCard"
import { CreateNewPopup } from "../../components/Popup"
import { CreateNewButton } from "../../components/CardButton"
import useResource, { useResourceCreate } from "../../hooks/useResource"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import { useNavigate } from "react-router-dom"

function ResourcesPage({ resourceName, resources, children }) {
  const [input, setInput] = useState(null)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()
  const create = useResourceCreate(resourceName + "s")

  const onInput = useCallback(
    async (label, value) => {
      if (process.env.NODE_ENV === "development")
        console.log("INPUT", { ...input, [label]: value })
      setInput({ ...input, [label]: value })
    },
    [input]
  )

  const onCreateConfirm = useCallback(async () => {
    setCreating(true)
    const created = await create(input)
    navigate("./" + created?._id)
  }, [create, input])

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

      <CreateNewPopup
        onConfirm={onCreateConfirm}
        resourceName={resourceName}
        creating={creating}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child))
            return React.cloneElement(child, {
              onInput,
              className: "mb-3",
              value: "",
              edit: true,
            })
        })}
      </CreateNewPopup>
    </>
  )
}

export const EmployeesPage = () => {
  const [employees] = useResource("employees")
  return (
    <ResourcesPage resources={employees} resourceName="employee">
      <EditableText label="short" />
      <EditableText label="title" />
      <hr />
      <EditableBadge resourceName="employment" />
      {/* <MultiBadge edit resourceName="work" />
      <MultiBadge edit resourceName="schedule" /> */}
      <MultiBadge edit resourceName="job" />
    </ResourcesPage>
  )
}

export function EmploymentsPage() {
  const [employments] = useResource("employments")
  return (
    <ResourcesPage resources={employments} resourceName="employment">
      <EditableText label="short" />
      <EditableText label="title" />
      <EditableText label="minHours" />
      <EditableText label="maxHours" />
    </ResourcesPage>
  )
}

export const FreetimesPage = () => {
  const [freetimes] = useResource("freetimes")
  return (
    <ResourcesPage resources={freetimes} resourceName="freetime">
      <EditableText label="short" />
      <EditableText label="title" />
      <EditableText label="start" />
      <EditableText label="end" />
      <EditableBadge resourceName="employee" />
    </ResourcesPage>
  )
}

export function JobsPage() {
  const [jobs] = useResource("jobs")
  return (
    <ResourcesPage resources={jobs} resourceName="job">
      <EditableText label="short" />
      <EditableText label="title" />
    </ResourcesPage>
  )
}

export function MissionsPage() {
  const [missions] = useResource("missions")
  return (
    <ResourcesPage resources={missions} resourceName="mission">
      <EditableText label="type" />
      <EditableText label="info" />
      <EditableText label="time" />
      <EditableText label="km" />
      <hr />
      <EditableBadge resourceName="work" />
    </ResourcesPage>
  )
}

export function RrulesPage() {
  const [rrules] = useResource("rrules")
  return (
    <ResourcesPage resources={rrules} resourceName="rrule">
      <EditableText label="short" />
      <EditableText label="content" />
      <hr />
      <EditableBadge resourceName="shift" />
    </ResourcesPage>
  )
}

export function SchedulesPage() {
  const [schedules] = useResource("schedules")
  return (
    <ResourcesPage resources={schedules} resourceName="schedule">
      <EditableText label="short" />
      <EditableText label="title" />
    </ResourcesPage>
  )
}

export function ShiftsPage() {
  const [shifts] = useResource("shifts")
  return (
    <ResourcesPage resources={shifts} resourceName="shift">
      <EditableText label="short" />
      <EditableText label="title" />
    </ResourcesPage>
  )
}

export function WorksPage() {
  const [works] = useResource("works")
  return (
    <ResourcesPage resources={works} resourceName="work">
      <EditableText label="short" />
      <EditableText label="title" />
      <EditableText label="start" />
      <EditableText label="end" />
      <EditableBadge resourceName="schedule" />
      <EditableBadge resourceName="shift" />
      <MultiBadge resourceName="employee" />
    </ResourcesPage>
  )
}

export default ResourcesPage

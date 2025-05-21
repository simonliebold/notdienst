import React, { useCallback, useEffect, useState } from "react"

import { useNavigate, useParams } from "react-router-dom"
import DetailedCard from "../../components/DetailedCard"

import useResource, {
  useResourceDelete,
  useResourceUpdate,
} from "../../hooks/useResource"
import Breadcrumb from "../../components/Breadcrumb"
import { ConfirmDeletePopup } from "../../components/Popup"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import { titles } from "../../variables"
import MultiTitleCard from "../../components/MultiTitleCard"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/esm/Col"

import { ScheduleCalendar } from "../../components/Calendar"
import { AsyncAllocateWorksButton } from "../../components/CardButton"

function ResourcePage({ resourceName, setData, buttons, children }) {
  const navigate = useNavigate()

  // fetch data
  const { id } = useParams()
  const [resource, updateResource] = useResource(resourceName + "s/" + id)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(resource)
    if (resource) setLoading(false)
    else setLoading(true)
  }, [resource, setData])

  // control input data
  const [input, setInput] = useState({})
  const onInput = useCallback(
    async (label, value) => {
      if (process.env.NODE_ENV === "development")
        console.log("INPUT", { ...input, [label]: value })
      setInput({ ...input, [label]: value })
    },
    [input]
  )

  // save data
  const [saving, setSaving] = useState(false)
  const save = useResourceUpdate(resourceName + "s/" + id)
  const onSaveRequest = useCallback(async () => {
    setSaving(true)
    await save(input)
    setSaving(false)
    setLoading(true)
    await updateResource()
    setInput({})
    setEdit(false)
    setLoading(false)
  }, [input, save, updateResource])

  const [edit, setEdit] = useState(false)
  const onEditRequest = useCallback(() => {
    setEdit(true)
  }, [setEdit])

  const onCloseRequest = useCallback(() => {
    setEdit(false)
  }, [setEdit])

  // popup delete
  const destroy = useResourceDelete(resourceName + "s/" + id)
  const [showConfirmDeletePopup, setShowConfirmDeletePopup] = useState(false)

  const onDeleteRequest = useCallback(() => {
    setShowConfirmDeletePopup(true)
  }, [setShowConfirmDeletePopup])

  const onDeleteConfirm = useCallback(async () => {
    await destroy()
    setShowConfirmDeletePopup(false)
    navigate("./../")
  }, [destroy])

  const onDeleteClose = useCallback(() => {
    setShowConfirmDeletePopup(false)
  }, [setShowConfirmDeletePopup])

  return (
    <div>
      <Breadcrumb resourceName={resourceName} resource={resource} />
      <ConfirmDeletePopup
        show={showConfirmDeletePopup}
        onConfirm={onDeleteConfirm}
        onClose={onDeleteClose}
        resource={resource}
        resourceName={resourceName}
      >
        Bist du sicher, dass du das löschen möchtest?
      </ConfirmDeletePopup>
      <DetailedCard
        resourceName={resourceName}
        resource={resource}
        loading={loading}
        saving={saving}
        onSaveRequest={onSaveRequest}
        edit={edit}
        onEditRequest={onEditRequest}
        onCloseRequest={onCloseRequest}
        onDeleteRequest={onDeleteRequest}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child))
            return React.cloneElement(child, {
              onInput,
              updateResource,
              className: "mb-3",
              edit,
            })
        })}
      </DetailedCard>
    </div>
  )
}

export const EmployeePage = () => {
  const [employee, setEmployee] = useState(null)
  return (
    <ResourcePage resourceName="employee" setData={setEmployee}>
      <EditableText value={employee?.short} label="short" />
      <EditableText value={employee?.title} label="title" />
      <hr />
      <EditableBadge
        resource={employee?.employment}
        resourceName="employment"
      />
      <MultiBadge items={employee?.works} resourceName="work" />
      <MultiBadge items={employee?.schedules} resourceName="schedule" />
      <MultiBadge items={employee?.jobs} resourceName="job" />
    </ResourcePage>
  )
}

export const EmploymentPage = () => {
  const [employment, setEmployment] = useState(null)
  return (
    <ResourcePage resourceName="employment" setData={setEmployment}>
      <EditableText value={employment?.short} label="short" />
      <EditableText value={employment?.title} label="title" />
      <EditableText value={employment?.minHours || ""} label="minHours" />
      <EditableText value={employment?.maxHours || ""} label="maxHours" />
      <hr />
      <MultiBadge items={employment?.employees} resourceName="employee" />
    </ResourcePage>
  )
}
export const FreetimePage = () => {
  const [freetime, setFreetime] = useState(null)
  return (
    <ResourcePage resourceName="freetime" setData={setFreetime}>
      <EditableText value={freetime?.start} label="start" />
      <EditableText value={freetime?.end} label="end" />
      <EditableText value={freetime?.type} label="type" />
      <hr />
      <EditableBadge resource={freetime?.employee} resourceName="employee" />
    </ResourcePage>
  )
}

export const JobPage = () => {
  const [job, setJob] = useState(null)
  return (
    <ResourcePage resourceName="job" setData={setJob}>
      <EditableText value={job?.short} label="short" />
      <EditableText value={job?.title} label="title" />
      <hr />
      <MultiBadge items={job?.employees} resourceName="employee" />
      <MultiBadge items={job?.shifts} resourceName="shift" />
    </ResourcePage>
  )
}

export const MissionPage = () => {
  const [mission, setMission] = useState(null)
  return (
    <ResourcePage resourceName="mission" setData={setMission}>
      <EditableText value={mission?.type} label="type" />
      <EditableText value={mission?.info} label="info" />
      <EditableText value={mission?.time} label="time" />
      <EditableText value={mission?.km} label="km" />
      <hr />
      <EditableBadge
        resource={mission?.employee}
        resourceName="employee"
        disabled
      />
      <EditableBadge resource={mission?.work} resourceName="work" disabled />
    </ResourcePage>
  )
}
export const RrulePage = () => {
  const [rrule, setRrule] = useState(null)

  return (
    <ResourcePage resourceName="rrule" setData={setRrule}>
      <EditableText value={rrule?.short} label="short" />
      <EditableText value={rrule?.content} label="content" />
      <hr />
      <EditableBadge resource={rrule?.shift} resourceName="shift" />
    </ResourcePage>
  )
}

export const SchedulePage = () => {
  const [schedule, setSchedule] = useState(null)
  return (
    <>
      <ResourcePage
        className="w-50"
        resourceName="schedule"
        setData={setSchedule}
      >
        <EditableText value={schedule?.short} label="short" />
        <EditableText value={schedule?.title} label="title" />
        <EditableText value={schedule?.start} label="start" />
        <EditableText value={schedule?.end} label="end" />
        <EditableText value={schedule?.deadline} label="deadline" />
        {/* <hr /> */}
        {/* <MultiBadge items={schedule?.works} resourceName="work" disabled /> */}
        <MultiBadge items={schedule?.shifts} resourceName="shift" />
        <MultiBadge items={schedule?.employees} resourceName="employee" />
        <AsyncAllocateWorksButton schedule={schedule} className="me-3" />
      </ResourcePage>
      <ScheduleCalendar schedule={schedule} className="my-3" />
    </>
  )
}

export const ShiftPage = () => {
  const [shift, setShift] = useState(null)

  return (
    <ResourcePage resourceName="shift" setData={setShift}>
      <EditableText value={shift?.short} label="short" />
      <EditableText value={shift?.title} label="title" />
      <hr />
      <MultiBadge items={shift?.rrules} resourceName="rrule" disabled />
      <MultiBadge items={shift?.schedules} resourceName="schedule" />
      <MultiBadge items={shift?.jobs} resourceName="job" />
    </ResourcePage>
  )
}

export const WorkPage = () => {
  const [work, setWork] = useState(null)

  return (
    <ResourcePage resourceName="work" setData={setWork}>
      <EditableText value={work?.start} label="start" />
      <EditableText value={work?.end} label="end" />
      <hr />
      <MultiBadge items={work?.employees} resourceName="employee" />
      <EditableBadge resource={work?.rrule} resourceName="rrule" disabled />
      <EditableBadge
        resource={work?.schedule}
        resourceName="schedule"
        disabled
      />
      <hr />
      <span>{titles.mission}:</span>
      <MultiTitleCard resources={work?.missions} resourceName="mission" />
    </ResourcePage>
  )
}

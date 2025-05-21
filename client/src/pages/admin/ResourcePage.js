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

import Calendar, {
  EmployeeCalendar,
  ScheduleCalendar,
} from "../../components/Calendar"
import { AsyncAllocateWorksButton } from "../../components/CardButton"
import useResourcePage from "../../hooks/useResourcePage"
import useInput from "../../hooks/useInput"
import useSave from "../../hooks/useSave"

function ResourcePage({ resourceName, buttons, children }) {
  return (
    <div></div>
    // <Breadcrumb resourceName={resourceName} resource={resource} />
    // <ConfirmDeletePopup
    //   show={showConfirmDeletePopup}
    //   onConfirm={onDeleteConfirm}
    //   onClose={onDeleteClose}
    //   resource={resource}
    //   resourceName={resourceName}
    // >
    //   Bist du sicher, dass du das löschen möchtest?
    // </ConfirmDeletePopup>
    // <DetailedCard
    //   resourceName={resourceName}
    //   resource={resource}
    //   loading={loading}
    //   saving={saving}
    //   onSaveRequest={onSaveRequest}
    //   edit={edit}
    //   onEditRequest={onEditRequest}
    //   onCloseRequest={onCloseRequest}
    //   onDeleteRequest={onDeleteRequest}
    // >

    //   {/* {React.Children.map(children, (child) => {
    //     if (React.isValidElement(child))
    //       return React.cloneElement(child, {
    //         onInput,
    //         updateResource,
    //         className: "mb-3",
    //         edit,
    //       })
    //   })} */}
    // </DetailedCard>
  )
}

export const EmployeePage = () => {
  const resourceName = "employee"

  const { id } = useParams()
  const [resource, refreshResource, loading] = useResource(
    resourceName + "s/" + id
  )
  const [edit, setEdit] = useState(false)
  const employee = resource

  const [input, onInput] = useInput(loading)
  const [saving, onSaveRequest] = useSave(
    resourceName,
    input,
    refreshResource,
    setEdit
  )

  return (
    <>
      <DetailedCard
        resourceName={"employee"}
        resource={employee}
        loading={loading}
        saving={saving}
        onSaveRequest={onSaveRequest}
        edit={edit}
        setEdit={setEdit}
      >
        <EditableText
          value={employee?.short}
          label="short"
          onInput={onInput}
          edit={edit}
        />
        <EditableText
          value={employee?.title}
          label="title"
          onInput={onInput}
          edit={edit}
        />

        <EditableBadge
          resource={employee?.employment}
          resourceName="employment"
          onInput={onInput}
          edit={edit}
        />
        <MultiBadge
          items={employee?.jobs}
          resourceName="job"
          onInput={onInput}
          edit={edit}
        />
        <MultiBadge
          items={employee?.freetimes}
          resourceName="freetime"
          onInput={onInput}
          edit={edit}
          disabled
        />
        {/* <ContainsItems resources={employee?.freetimes} resourceName="freetime" /> */}
        <EmployeeCalendar employee={employee} />
      </DetailedCard>
    </>
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
    </ResourcePage>
  )
}
export const FreetimePage = () => {
  const [freetime, setFreetime] = useState(null)
  return (
    <ResourcePage resourceName="freetime" setData={setFreetime}>
      <EditableText value={freetime?.short} label="short" />
      <EditableText value={freetime?.title} label="title" />
      <EditableText value={freetime?.start} label="start" />
      <EditableText value={freetime?.end} label="end" />
      <EditableBadge
        resource={freetime?.employee}
        resourceName="employee"
        disabled
      />
    </ResourcePage>
  )
}

export const JobPage = () => {
  const [job, setJob] = useState(null)
  return (
    <ResourcePage resourceName="job" setData={setJob}>
      <EditableText value={job?.short} label="short" />
      <EditableText value={job?.title} label="title" />

      <MultiBadge items={job?.employees} resourceName="employee" disabled />
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
      <EditableText value={rrule?.start} label="start" />
      <EditableText value={rrule?.end} label="end" />
      <EditableText value={rrule?.content} label="content" />
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
        <AsyncAllocateWorksButton schedule={schedule} className="me-3" />
      </ResourcePage>
      <ScheduleCalendar schedule={schedule} />
    </>
  )
}

export const ShiftPage = () => {
  const [shift, setShift] = useState(null)

  return (
    <ResourcePage resourceName="shift" setData={setShift}>
      <EditableText value={shift?.short} label="short" />
      <EditableText value={shift?.title} label="title" />

      <MultiBadge items={shift?.jobs} resourceName="job" />
      <MultiBadge items={shift?.rrules} resourceName="rrule" disabled />
    </ResourcePage>
  )
}

export const WorkPage = () => {
  const [work, setWork] = useState(null)

  return (
    <ResourcePage resourceName="work" setData={setWork}>
      <EditableText value={work?.short} label="short" />
      <EditableText value={work?.title} label="title" />
      <EditableText value={work?.start} label="start" />
      <EditableText value={work?.end} label="end" />
      <MultiBadge items={work?.employees} resourceName="employee" />
      <EditableBadge resource={work?.shift} resourceName="shift" />
      <EditableBadge resource={work?.schedule} resourceName="schedule" />
      <MultiBadge items={work?.jobs} resourceName="job" disabled />
    </ResourcePage>
  )
}

export const ExchangePage = () => {
  const [exchange, setExchange] = useState(null)

  return (
    <ResourcePage resourceName="exchange" setData={setExchange}>
      <EditableText value={exchange?.short} label="short" />
      <EditableText value={exchange?.title} label="title" />
      <MultiBadge
        items={exchange?.sender}
        resourceName="employee"
        customName="sender"
      />
      <EditableBadge
        resource={exchange?.outgoing}
        resourceName="work"
        customName="outgoing"
      />
      <MultiBadge
        items={exchange?.receiver}
        resourceName="employee"
        customName="receiver"
      />
      <EditableBadge
        resource={exchange?.incoming}
        resourceName="work"
        customName="incoming"
      />
    </ResourcePage>
  )
}

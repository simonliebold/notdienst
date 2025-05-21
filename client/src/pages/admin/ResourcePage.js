import React, { useState } from "react"
import DetailedCard from "../../components/DetailedCard"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import { EmployeeCalendar, ScheduleCalendar } from "../../components/Calendar"
import {
  AsyncAllocateWorksButton,
  AsyncGenerateWorksButton,
} from "../../components/CardButton"

import { useParams } from "react-router-dom"
import useResource from "./../../hooks/useResource"
import useInput from "./../../hooks/useInput"
import useSave from "./../../hooks/useSave"

const useResourcePage = (resourceName) => {
  const { id } = useParams()
  const [resource, refreshResource, loading] = useResource(
    resourceName + "s/" + id
  )
  const [edit, setEdit] = useState(false)

  const [input, onInput] = useInput(loading)
  const [saving, onSaveRequest] = useSave(
    resourceName,
    input,
    refreshResource,
    setEdit
  )

  return {
    resource,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
    refreshResource,
  }
}

export const EmployeePage = () => {
  const {
    resource: employee,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  } = useResourcePage("employee")

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
      </DetailedCard>
      <EmployeeCalendar employee={employee} />
    </>
  )
}

export const EmploymentPage = () => {
  const {
    resource: employment,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  } = useResourcePage("employment")
  return (
    <DetailedCard
      resourceName={"employment"}
      resource={employment}
      loading={loading}
      saving={saving}
      onSaveRequest={onSaveRequest}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        value={employment?.short}
        label="short"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={employment?.title}
        label="title"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={employment?.minHours || ""}
        label="minHours"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={employment?.maxHours || ""}
        label="maxHours"
        onInput={onInput}
        edit={edit}
      />
    </DetailedCard>
  )
}
export const FreetimePage = () => {
  const {
    resource: freetime,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  } = useResourcePage("freetime")
  return (
    <DetailedCard
      resourceName={"freetime"}
      resource={freetime}
      loading={loading}
      saving={saving}
      onSaveRequest={onSaveRequest}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        value={freetime?.short}
        label="short"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={freetime?.title}
        label="title"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={freetime?.start}
        label="start"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={freetime?.end}
        label="end"
        onInput={onInput}
        edit={edit}
      />
      <EditableBadge
        resource={freetime?.employee}
        resourceName="employee"
        onInput={onInput}
        edit={edit}
        disabled
      />
    </DetailedCard>
  )
}

export const JobPage = () => {
  const {
    resource: job,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  } = useResourcePage("job")
  return (
    <DetailedCard
      resourceName={"job"}
      resource={job}
      loading={loading}
      saving={saving}
      onSaveRequest={onSaveRequest}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        value={job?.short}
        label="short"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={job?.title}
        label="title"
        onInput={onInput}
        edit={edit}
      />

      <MultiBadge
        items={job?.employees}
        resourceName="employee"
        disabled
        onInput={onInput}
        edit={edit}
      />
    </DetailedCard>
  )
}

export const MissionPage = () => {
  const {
    resource: mission,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  } = useResourcePage("mission")
  return (
    <DetailedCard
      resourceName={"mission"}
      resource={mission}
      loading={loading}
      saving={saving}
      onSaveRequest={onSaveRequest}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        value={mission?.type}
        label="type"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={mission?.info}
        label="info"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={mission?.time}
        label="time"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={mission?.km}
        label="km"
        onInput={onInput}
        edit={edit}
      />

      <EditableBadge
        resource={mission?.employee}
        resourceName="employee"
        onInput={onInput}
        edit={edit}
        disabled
      />
      <EditableBadge resource={mission?.work} resourceName="work" disabled />
    </DetailedCard>
  )
}
export const RrulePage = () => {
  const {
    resource: rrule,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  } = useResourcePage("rrule")

  return (
    <DetailedCard
      resourceName={"rrule"}
      resource={rrule}
      loading={loading}
      saving={saving}
      onSaveRequest={onSaveRequest}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        value={rrule?.short}
        label="short"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={rrule?.start}
        label="start"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={rrule?.end}
        label="end"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={rrule?.content}
        label="content"
        onInput={onInput}
        edit={edit}
      />
      <EditableBadge
        resource={rrule?.shift}
        resourceName="shift"
        onInput={onInput}
        edit={edit}
      />
    </DetailedCard>
  )
}

export const SchedulePage = () => {
  const {
    resource: schedule,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
    refreshResource,
  } = useResourcePage("schedule")
  return (
    <>
      <DetailedCard
        resourceName={"schedule"}
        resource={schedule}
        loading={loading}
        saving={saving}
        onSaveRequest={onSaveRequest}
        edit={edit}
        setEdit={setEdit}
      >
        <EditableText
          value={schedule?.short}
          label="short"
          onInput={onInput}
          edit={edit}
        />
        <EditableText
          value={schedule?.title}
          label="title"
          onInput={onInput}
          edit={edit}
        />
        <EditableText
          value={schedule?.start}
          label="start"
          onInput={onInput}
          edit={edit}
        />
        <EditableText
          value={schedule?.end}
          label="end"
          onInput={onInput}
          edit={edit}
        />
        {/* <AsyncGenerateWorksButton
          schedule={schedule}
          updateResource={refreshResource}
          className="me-3"
          variant="warning"
          onInput={onInput}
          edit={edit}
          /> */}
        <AsyncAllocateWorksButton
          schedule={schedule}
          updateResource={refreshResource}
          className="me-3"
          onInput={onInput}
          edit={edit}
        />
      </DetailedCard>
      <ScheduleCalendar schedule={schedule} />
    </>
  )
}

export const ShiftPage = () => {
  const {
    resource: shift,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  } = useResourcePage("shift")

  return (
    <DetailedCard
      resourceName={"shift"}
      resource={shift}
      loading={loading}
      saving={saving}
      onSaveRequest={onSaveRequest}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        value={shift?.short}
        label="short"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={shift?.title}
        label="title"
        onInput={onInput}
        edit={edit}
      />

      <MultiBadge
        items={shift?.jobs}
        resourceName="job"
        onInput={onInput}
        edit={edit}
      />
      <MultiBadge
        items={shift?.rrules}
        resourceName="rrule"
        disabled
        onInput={onInput}
        edit={edit}
      />
    </DetailedCard>
  )
}

export const WorkPage = () => {
  const {
    resource: work,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  } = useResourcePage("work")

  return (
    <DetailedCard
      resourceName={"work"}
      resource={work}
      loading={loading}
      saving={saving}
      onSaveRequest={onSaveRequest}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        value={work?.short}
        label="short"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={work?.title}
        label="title"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={work?.start}
        label="start"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={work?.end}
        label="end"
        onInput={onInput}
        edit={edit}
      />
      <MultiBadge
        items={work?.employees}
        resourceName="employee"
        onInput={onInput}
        edit={edit}
      />
      <EditableBadge
        resource={work?.shift}
        resourceName="shift"
        onInput={onInput}
        edit={edit}
      />
      <EditableBadge
        resource={work?.schedule}
        resourceName="schedule"
        onInput={onInput}
        edit={edit}
      />
      <MultiBadge
        items={work?.jobs}
        resourceName="job"
        disabled
        onInput={onInput}
        edit={edit}
      />
    </DetailedCard>
  )
}

export const ExchangePage = () => {
  const {
    resource: exchange,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  } = useResourcePage("exchange")

  return (
    <DetailedCard
      resourceName={"exchange"}
      resource={exchange}
      loading={loading}
      saving={saving}
      onSaveRequest={onSaveRequest}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        value={exchange?.short}
        label="short"
        onInput={onInput}
        edit={edit}
      />
      <EditableText
        value={exchange?.title}
        label="title"
        onInput={onInput}
        edit={edit}
      />
      <hr />
      <div className="row row-cols-sm-2">
        <MultiBadge
          items={exchange?.sender}
          resourceName="employee"
          customName="sender"
          onInput={onInput}
          edit={edit}
        />
        <MultiBadge
          items={exchange?.receiver}
          resourceName="employee"
          customName="receiver"
          onInput={onInput}
          edit={edit}
        />
      </div>

      <div className="row row-cols-sm-2">
        <EditableBadge
          resource={exchange?.outgoing}
          resourceName="work"
          customName="outgoing"
          onInput={onInput}
          edit={edit}
        />
        <EditableBadge
          resource={exchange?.incoming}
          resourceName="work"
          customName="incoming"
          onInput={onInput}
          edit={edit}
        />
      </div>
    </DetailedCard>
  )
}

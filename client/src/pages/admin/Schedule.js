import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"

function Schedule() {
  const [schedule, setSchedule] = useState(null)

  return (
    <Resource resourceName="schedule" setData={setSchedule}>
      <EditableText value={schedule?.short} label="short" />
      <EditableText value={schedule?.title} label="title" />
      <EditableText value={schedule?.start} label="start" />
      <EditableText value={schedule?.end} label="end" />
      <EditableText value={schedule?.deadline} label="deadline" />
      <hr />
      <MultiBadge items={schedule?.works} resourceName="work" disabled />
      <MultiBadge items={schedule?.shifts} resourceName="shift" />
      <MultiBadge items={schedule?.employees} resourceName="employee" />
    </Resource>
  )
}
export default Schedule

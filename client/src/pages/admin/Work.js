import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"

function Work() {
  const [work, setWork] = useState(null)

  return (
    <Resource resourceName="work" setData={setWork}>
      <EditableText value={work?.short} label="short" disabled />
      <EditableText value={work?.title} label="title" disabled />
      <EditableText value={work?.start} label="start" />
      <EditableText value={work?.end} label="end" />
      <hr />
      <EditableBadge resource={work?.rrule} resourceName="rrule" disabled />
      <EditableBadge resource={work?.schedule} resourceName="schedule" disabled />
      <MultiBadge items={work?.employees} resourceName="employee" />
      <MultiBadge items={work?.missions} resourceName="mission" />
    </Resource>
  )
}
export default Work

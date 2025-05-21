import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"
import TitleCard from "../../components/TitleCard"
import { titles } from "../../variables"
import MultiTitleCard from "../../components/MultiTitleCard"

function Work() {
  const [work, setWork] = useState(null)

  return (
    <Resource resourceName="work" setData={setWork}>
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
    </Resource>
  )
}
export default Work

import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"

function Employment() {
  const [employment, setEmployment] = useState(null)

  return (
    <Resource resourceName="employment" setData={setEmployment}>
      <EditableText value={employment?.short} label="short" />
      <EditableText value={employment?.title} label="title" />
      <EditableText value={employment?.minHours || ""} label="minHours" />
      <EditableText value={employment?.maxHours || ""} label="maxHours" />
      <hr />
      <MultiBadge items={employment?.employees} resourceName="employee" />
    </Resource>
  )
}
export default Employment

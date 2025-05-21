import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"

function Employee() {
  const [employee, setEmployee] = useState(null)

  return (
    <Resource resourceName="employee" setData={setEmployee}>
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
    </Resource>
  )
}
export default Employee

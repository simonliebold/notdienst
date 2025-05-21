import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"

function Job() {
  const [job, setJob] = useState(null)

  return (
    <Resource resourceName="job" setData={setJob}>
      <EditableText value={job?.short} label="short" />
      <EditableText value={job?.title} label="title" />
      <hr />
      <MultiBadge items={job?.employees} resourceName="employee" />
      <MultiBadge items={job?.shifts} resourceName="shift" />
    </Resource>
  )
}
export default Job

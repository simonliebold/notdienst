import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"

function Shift() {
  const [shift, setShift] = useState(null)

  return (
    <Resource resourceName="shift" setData={setShift}>
      <EditableText value={shift?.short} label="short" />
      <EditableText value={shift?.title} label="title" />
      <hr />
      <MultiBadge items={shift?.rrules} resourceName="rrule" disabled />
      <MultiBadge items={shift?.schedules} resourceName="schedule" />
      <MultiBadge items={shift?.jobs} resourceName="job" />
    </Resource>
  )
}
export default Shift

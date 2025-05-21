import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import ResourcePage from "./ResourcePage"

function Rrule() {
  const [rrule, setRrule] = useState(null)

  return (
    <ResourcePage resourceName="rrule" setData={setRrule}>
      <EditableText value={rrule?.short} label="short" />
      <EditableText value={rrule?.title} label="title" />
      <EditableText value={rrule?.content} label="content" />
      <hr />
      <EditableBadge resource={rrule?.shift} resourceName="shift" />
    </ResourcePage>
  )
}

export default Rrule

import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"
import { localeString } from "../../variables"

// TODO: create EditableDateInput
// new Date(freetime?.date).toLocaleDateString(localeString.country)
function Freetime() {
  const [freetime, setFreetime] = useState(null)
  return (
    <Resource resourceName="freetime" setData={setFreetime}>
      <EditableText value={freetime?.date} label="date" />
      <EditableText value={freetime?.type} label="type" />
      <hr />
      <EditableBadge resource={freetime?.employee} resourceName="employee" />
      <EditableBadge resource={freetime?.schedule} resourceName="schedule" />
    </Resource>
  )
}
export default Freetime

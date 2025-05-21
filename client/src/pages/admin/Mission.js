import React, { useState } from "react"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"
import { localeString } from "../../variables"

// TODO: create EditableDateInput
// new Date(mission?.date).toLocaleDateString(localeString.country)
function Mission() {
  const [mission, setMission] = useState(null)
  return (
    <Resource resourceName="mission" setData={setMission}>
      <EditableText value={mission?.type} label="type" />
      <EditableText value={mission?.info} label="info" />
      <EditableText value={mission?.time} label="time" />
      <EditableText value={mission?.km} label="km" />
      <hr />
      <EditableBadge resource={mission?.employee} resourceName="employee" disabled />
      <EditableBadge resource={mission?.work} resourceName="work" disabled />
    </Resource>
  )
}
export default Mission

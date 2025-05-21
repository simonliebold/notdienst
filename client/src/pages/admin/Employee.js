import React, { useCallback, useEffect, useState } from "react"

import { useNavigate, useParams } from "react-router-dom"
import DetailedCard from "../../components/DetailedCard"

import useResource, { useResourceUpdate } from "../../hooks/useResource"
import Breadcrumb from "../../components/Breadcrumb"
import { titles } from "../../variables"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"
import Resource from "./ResourcePage"

function Employee() {
  const [employee, setEmployee] = useState(null)

  useEffect(() => {
    console.log("employee", employee)
  }, [employee])

  return (
    <Resource resourceName="employee" setData={setEmployee}>
      <EditableText value={employee?.short} label="short" />
      <EditableText value={employee?.title} label="title" />
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

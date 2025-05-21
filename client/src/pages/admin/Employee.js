import React, { useCallback, useEffect, useState } from "react"

import { useNavigate, useParams } from "react-router-dom"
import DetailedCard from "./../../components/DetailedCard"

import useResource, { useResourceUpdate } from "../../hooks/useResource"
import Breadcrumb from "../../components/Breadcrumb"
import { titles } from "../../variables"
import EditableText from "../../components/EditableText"
import { EditableBadge } from "../../components/Badge"
import MultiBadge from "../../components/MultiBadge"

function Employee() {
  // Fetch
  const { employeeId } = useParams()
  const [employee, updateEmployee] = useResource("employees/" + employeeId)
  const { short, title, employment, works, schedules, jobs } = employee || {}
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (employee) setLoading(false)
    else setLoading(true)
  }, [employee])

  // Input
  const [input, setInput] = useState(employee)
  const onInput = async (label, value) => {
    setInput({ ...input, [label]: value })
  }

  // Save
  const save = useResourceUpdate("employees/" + employeeId)
  const navigate = useNavigate()
  const onSave = async () => {
    ;(async () => {
      setLoading(true)
      await save(input)
      await updateEmployee()
      navigate("./../")
      setLoading(false)
    })()
  }

  return (
    <>
      <Breadcrumb resourceName="employee" resource={employee} />
      <DetailedCard
        resourceName="employee"
        resource={employee}
        loading={loading}
        onSave={onSave}
      >
        <div className="">
          <EditableText value={short} label="short" onInput={onInput} />
          <EditableText value={title} label="title" onInput={onInput} />
        </div>
        <div className="">
          Anstellungsverhältnis:
          <EditableBadge
            resource={employment}
            resourceName="employment"
            onInput={onInput}
          />
        </div>
        <div className="">
          Dienste:
          <MultiBadge items={works} resourceName="work" onInput={onInput} />
        </div>
        <div className="">
          Schichtpläne:
          <MultiBadge
            items={schedules}
            resourceName="schedule"
            onInput={onInput}
          />
        </div>
        <div className="">
          Jobs:
          <MultiBadge items={jobs} resourceName="job" onInput={onInput} />
        </div>
      </DetailedCard>
    </>
  )
}
export default Employee

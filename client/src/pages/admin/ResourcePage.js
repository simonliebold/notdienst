import React, { useCallback, useEffect, useState } from "react"

import { useNavigate, useParams } from "react-router-dom"
import DetailedCard from "../../components/DetailedCard"

import useResource, { useResourceUpdate } from "../../hooks/useResource"
import Breadcrumb from "../../components/Breadcrumb"

function ResourcePage({ resourceName, setData, children }) {
  // fetch data
  const { id } = useParams()
  const [resource, updateResource] = useResource(resourceName + "s/" + id)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(resource)
    if (resource) setLoading(false)
    else setLoading(true)
  }, [resource])

  // control input data
  const [input, setInput] = useState({})
  const onInput = async (label, value) => {
    if (process.env.NODE_ENV === "development")
      console.log("INPUT", { ...input, [label]: value })
    setInput({ ...input, [label]: value })
  }

  // save data
  const save = useResourceUpdate(resourceName + "s/" + id)
  const navigate = useNavigate()
  const onSave = async () => {
    ;(async () => {
      setLoading(true)
      await save(input)
      await updateResource()
      setInput({})
      navigate("./../")
      setLoading(false)
    })()
  }

  return (
    <>
      <Breadcrumb resourceName={resourceName} resource={resource} />
      <DetailedCard
        resourceName={resourceName}
        resource={resource}
        loading={loading}
        onSave={onSave}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child))
            return React.cloneElement(child, { onInput, className: "mb-3" })
        })}
      </DetailedCard>
    </>
  )
}
export default ResourcePage

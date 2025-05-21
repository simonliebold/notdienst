import React, { useCallback, useEffect, useState } from "react"

import { useNavigate, useParams } from "react-router-dom"
import DetailedCard from "../../components/DetailedCard"

import useResource, { useResourceDelete, useResourceUpdate } from "../../hooks/useResource"
import Breadcrumb from "../../components/Breadcrumb"
import Popup, { DeletePopup } from "../../components/Popup"

function ResourcePage({ resourceName, setData, children }) {
  const navigate = useNavigate()

  // fetch data
  const { id } = useParams()
  const [resource, updateResource] = useResource(resourceName + "s/" + id)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(resource)
    if (resource) setLoading(false)
    else setLoading(true)
  }, [resource, setData])

  // control input data
  const [input, setInput] = useState({})
  const onInput = useCallback(
    async (label, value) => {
      if (process.env.NODE_ENV === "development")
        console.log("INPUT", { ...input, [label]: value })
      setInput({ ...input, [label]: value })
    },
    [input]
  )

  // save data
  const [saving, setSaving] = useState(false)
  const save = useResourceUpdate(resourceName + "s/" + id)
  const onSaveRequest = useCallback(async () => {
    setSaving(true)
    await save(input)
    setSaving(false)
    setLoading(true)
    await updateResource()
    setInput({})
    setEdit(false)
    setLoading(false)
  }, [input, save, updateResource])

  const [edit, setEdit] = useState(false)
  const onEditRequest = useCallback(() => {
    setEdit(true)
  }, [setEdit])

  const onCloseRequest = useCallback(() => {
    setEdit(false)
  }, [setEdit])

  // popup delete
  const destroy = useResourceDelete(resourceName + "s/" + id)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  const onDeleteRequest = useCallback(() => {
    setShowDeletePopup(true)
  }, [setShowDeletePopup])

  const onDeleteConfirm = useCallback(async () => {
    await destroy()
    setShowDeletePopup(false)
    navigate("./../")
  }, [destroy])

  const onDeleteClose = useCallback(() => {
    setShowDeletePopup(false)
  }, [setShowDeletePopup])

  return (
    <>
      <Breadcrumb resourceName={resourceName} resource={resource} />
      <DeletePopup
        show={showDeletePopup}
        onConfirm={onDeleteConfirm}
        onClose={onDeleteClose}
        resource={resource}
        resourceName={resourceName}
      >
        Bist du sicher, dass du das löschen möchtest?
      </DeletePopup>
      <DetailedCard
        resourceName={resourceName}
        resource={resource}
        loading={loading}
        saving={saving}
        onSaveRequest={onSaveRequest}
        edit={edit}
        onEditRequest={onEditRequest}
        onCloseRequest={onCloseRequest}
        onDeleteRequest={onDeleteRequest}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child))
            return React.cloneElement(child, {
              onInput,
              className: "mb-3",
              edit,
            })
        })}
      </DetailedCard>
    </>
  )
}
export default ResourcePage

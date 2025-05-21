import { useInRouterContext, useNavigate, useParams } from "react-router-dom"
import useResource, {
  useResourceDelete,
  useResourceUpdate,
} from "./useResource"
import { useCallback, useEffect, useState } from "react"
import useInput from "./useInput"
import useSave from "./useSave"

const useResourcePage = ({ resourceName }) => {
  const { id } = useParams()
  const [resource, refreshResource, loading] = useResource(
    resourceName + "s/" + id
  )
  const [edit, setEdit] = useState(false)

  const [input, onInput] = useInput(loading)
  const [saving, onSaveRequest] = useSave(
    resourceName,
    input,
    refreshResource,
    setEdit
  )

  return {
    resource,
    loading,
    saving,
    onSaveRequest,
    edit,
    setEdit,
    onInput,
  }
}
export default useResourcePage

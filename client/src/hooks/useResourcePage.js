import { useInRouterContext, useNavigate, useParams } from "react-router-dom"
import useResource, {
  useResourceDelete,
  useResourceUpdate,
} from "./useResource"
import { useCallback, useEffect, useState } from "react"
import useInput from "./useInput"

const useResourcePage = ({ resourceName }) => {
  const { id } = useParams()
  const [resource, updateResource, loading] = useResource(
    resourceName + "s/" + id
  )
  const [input, onInput] = useInput(loading)

  const [save, saving] = useResourceUpdate(resourceName + "s/" + id)

  const onSaveRequest = useCallback(async () => {
    await save(input)
    await updateResource()
    setEdit(false)
  }, [input, save, updateResource])

  const [edit, setEdit] = useState(false)
  
  const onEditRequest = useCallback(() => {
    setEdit(true)
  }, [setEdit])

  const onCloseRequest = useCallback(() => {
    setEdit(false)
  }, [setEdit])


  return {
    resource,
    loading,
    saving,
    onSaveRequest,
    edit,
    onEditRequest,
    onCloseRequest,
    onInput,
    updateResource,
  }
}
export default useResourcePage

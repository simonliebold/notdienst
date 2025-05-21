import { useParams } from "react-router-dom"
import { useResourceUpdate } from "./useResource"
import { useCallback } from "react"

const useSave = (resourceName, input, refresh, setEdit) => {
  const { id } = useParams()
  const [save, saving] = useResourceUpdate(resourceName + "s/" + id)

  const onSave = useCallback(async () => {
    await save(input)
    await refresh()
    setEdit(false)
  }, [input, save, refresh])

  return [saving, onSave]
}

export default useSave

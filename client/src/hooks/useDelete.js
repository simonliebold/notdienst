import { useCallback, useState } from "react"
import { useResourceDelete } from "./useResource"
import { useNavigate } from "react-router-dom"

export const useDelete = (resource, resourceName) => {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const [destroy, deleting] = useResourceDelete(resourceName + "s/" + resource?._id)

  const open = useCallback(() => {
    setShow(true)
  }, [setShow])

  const submit = useCallback(async () => {
    await destroy()
    setShow(false)
    navigate("./../")
  }, [destroy])

  const close = useCallback(() => {
    setShow(false)
  }, [setShow])

  const [disabled, setDisabled] = useState(true)
  const [input, setInput] = useState("")

  const onInput = useCallback(
    (input) => {
      const newInput = input.target.value.toUpperCase()
      setInput(newInput)
      if (newInput === resource?.short.toUpperCase()) setDisabled(false)
      else setDisabled(true)
    },
    [resource, setDisabled]
  )

  return [show, open, close, submit, deleting, input, onInput, disabled]
}

export default useDelete

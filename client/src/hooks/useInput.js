import { useCallback, useEffect, useState } from "react"

const useInput = (loading) => {
  const [input, setInput] = useState({})

  useEffect(() => {
    if (process.env.NODE_ENV === "development") console.log("onInput", input)
  }, [input])

  useEffect(() => {
    setInput({})
  }, [loading])

  const onInput = useCallback(
    async (label, value) => {
      setInput({ ...input, [label]: value })
    },
    [input]
  )

  return [input, onInput]
}

export default useInput

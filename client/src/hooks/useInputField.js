import { useCallback, useEffect, useState } from "react"

const useInputField = (defaultValue, label, onInput) => {
  const [input, setInput] = useState(defaultValue)

  const onChange = useCallback(
    (e) => {
      setInput(e.target.value)
      if (onInput) onInput(label, e.target.value)
    },
    [label, onInput]
  )

  useEffect(() => {
    setInput(defaultValue)
  }, [defaultValue])

  return [input, onChange]
}

export default useInputField

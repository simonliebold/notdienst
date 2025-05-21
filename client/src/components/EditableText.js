import React, { useCallback, useEffect, useState } from "react"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel"
import { labels } from "../variables"

const EditableText = ({ value, label, onInput, className, edit }) => {
  const [input, setInput] = useState(value)

  const onChange = useCallback((e) => {
    setInput(e.target.value)
    if (onInput) onInput(label, e.target.value)
  }, [label, onInput])

  useEffect(() => {
    setInput(value)
  }, [value])

  if (!edit)
    return (
      <p className={"mb-0 "+className}>
        {labels[label] + ": "}
        {value !== null && value}
        {value === null && "Kein Wert gesetzt"}
      </p>
    )
  else
    return (
      <FloatingLabel label={labels[label]} className={className}>
        <Form.Control
          placeholder=""
          value={input}
          onChange={onChange}
        ></Form.Control>
      </FloatingLabel>
    )
}

export default EditableText

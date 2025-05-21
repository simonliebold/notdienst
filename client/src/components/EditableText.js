import React, { useCallback, useEffect, useState } from "react"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel"
import { useParams } from "react-router-dom"
import { labels } from "../variables"

const EditableText = ({ value, label, onInput, className }) => {
  const { action } = useParams()
  const [input, setInput] = useState(value)

  const onChange = (e) => {
    setInput(e.target.value)
    if (onInput) onInput(label, e.target.value)
  }

  useEffect(() => {
    setInput(value)
  }, [value])

  if (action !== "edit")
    return (
      <p className={className}>
        {labels[label] + ": "}
        {value !== null && value}
        {value === null && "Kein Wert gesetzt"}
      </p>
    )
  else
    return (
      <p className={className}>
        <FloatingLabel label={labels[label]}>
          <Form.Control
            placeholder=""
            value={input}
            defaultValue={value}
            onChange={onChange}
          ></Form.Control>
        </FloatingLabel>
      </p>
    )
}

export default EditableText

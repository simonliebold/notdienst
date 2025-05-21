import React from "react"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel"
import { labels } from "../variables"
import useInputField from "../hooks/useInputField"

const EditableText = ({ value, label, onInput, className, edit }) => {
  const [input, onChange] = useInputField(value, label, onInput)

  if (!edit)
    return (
      <p className={"mb-3 " + className}>
        {labels[label] + ": "}
        {value !== null && value}
        {value === null && "Kein Wert gesetzt"}
      </p>
    )
  else
    return (
      <FloatingLabel label={labels[label]} className={"mb-3 " + className}>
        <Form.Control
          placeholder=""
          value={input}
          onChange={onChange}
        ></Form.Control>
      </FloatingLabel>
    )
}

export default EditableText

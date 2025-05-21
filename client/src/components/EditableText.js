import React, { useCallback, useState } from "react"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel"
import { useParams } from "react-router-dom"
import { labels } from "../variables"

const EditableText = ({ value, label, onInput, className }) => {
  const { action } = useParams()
  const [input, setInput] = useState(value)

  // if (process.env.NODE_ENV === "development")
  //   console.log("Input", labels[label], input)

  const onChange = (e) => {
    setInput(e.target.value)
    onInput(label, e.target.value)
  }

  if (action !== "edit") return <p className={className}>{labels[label] + ": " + value}</p>
  else
    return (
      <p className={className}>
        <FloatingLabel label={labels[label]}>
          <Form.Control
            placeholder=""
            value={input}
            onChange={onChange}
          ></Form.Control>
        </FloatingLabel>
      </p>
    )
}

export default EditableText

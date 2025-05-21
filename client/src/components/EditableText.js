import React, { useCallback, useState } from "react"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel"
import { useParams } from "react-router-dom"
import { labels } from "../variables"

const EditableText = ({ value, label, onInput }) => {
  const { action } = useParams()
  const [input, setInput] = useState(value)

  // if (process.env.NODE_ENV === "development")
  //   console.log("Input", labels[label], input)

  const onChange = (e) => {
    setInput(e.target.value)
    onInput(label, e.target.value)
  }

  if (action !== "edit") return <p>{labels[label] + ": " + value}</p>
  else
    return (
      <>
        <FloatingLabel controlId={label} label={labels[label]}>
          <Form.Control
            placeholder=""
            value={input}
            onChange={onChange}
          ></Form.Control>
        </FloatingLabel>
      </>
    )
}

export default EditableText

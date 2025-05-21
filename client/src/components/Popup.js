import React, { useCallback, useEffect, useState } from "react"
import FormControl from "react-bootstrap/FormControl"
import Modal from "react-bootstrap/Modal"
import {
  CancelButton,
  CardDeleteButton,
  ConfirmDeleteButton,
} from "./CardButton"
import { title } from "../variables"
import Badge from "./Badge"

function Popup({
  children,
  title,
  buttons,
  show = true,
  onClose,
  onRequestShow,
  ...props
}) {
  return (
    <Modal show={show} onHide={onClose} {...props}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>{buttons}</Modal.Footer>
    </Modal>
  )
}

export const DeletePopup = ({
  onConfirm,
  onClose,
  resource,
  resourceName,
  ...props
}) => {
  const [disabled, setDisabled] = useState(true)
  const [input, setInput] = useState("")

  const onInput = useCallback(
    (e) => {
      const newInput = e.target.value.toUpperCase()
      console.log(newInput, resource?.short)
      setInput(newInput)
      if (newInput == resource?.short) setDisabled(false)
      else setDisabled(true)
    },
    [resource, setDisabled]
  )

  return (
    <Popup
      {...props}
      onClose={onClose}
      title={
        <>
          <Badge
            resource={resource}
            resourceName={resourceName}
            className="me-2"
          />
          {resource?.title + " löschen"}
        </>
      }
      buttons={
        <>
          <CancelButton onClick={onClose} />
          <ConfirmDeleteButton
            onClick={onConfirm}
            resource={resource}
            resourceName={resourceName}
            disabled={disabled}
          />
        </>
      }
    >
      Soll <strong>{resource?.title}</strong> wirklich gelöscht werden?
      <hr />
      Um diese Aktion zu bestätigen, gib bitte{" "}
      <strong>{resource?.short}</strong> in das Eingabefeld ein:
      <FormControl
        className="mt-2"
        autoFocus
        value={input}
        onChange={onInput}
      ></FormControl>
    </Popup>
  )
}

export default Popup

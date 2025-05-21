import React, { useCallback, useState } from "react"
import FormControl from "react-bootstrap/FormControl"
import Modal from "react-bootstrap/Modal"
import {
  CancelButton,
  ConfirmCreateNewButton,
  ConfirmDeleteButton,
  CreateNewButton,
} from "./CardButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrash, faX } from "@fortawesome/free-solid-svg-icons"
import { title } from "../variables"

function Popup({
  children,
  title,
  icon,
  buttons,
  show = false,
  onClose,
  onRequestShow,
  ...props
}) {
  return (
    <Modal show={show} onHide={onClose} {...props}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={icon} size="xs" className="me-2" />
          {title}
        </Modal.Title>
      </Modal.Header>
      {children && <Modal.Body>{children}</Modal.Body>}
      {buttons && <Modal.Footer>{buttons}</Modal.Footer>}
    </Modal>
  )
}

export const ConfirmDeletePopup = ({
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
      title="Endgültig löschen bestätigen"
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

export const CreateNewPopup = ({
  resource,
  resourceName,
  onClose,
  onConfirm,
  creating,
  children,
  ...props
}) => {
  const [show, setShow] = useState(false)

  const close = useCallback(() => {
    setShow(false)
  }, [show, setShow])

  const open = useCallback(() => {
    setShow(true)
  }, [show, setShow])

  return (
    <>
      <CreateNewButton
        onClick={open}
        resourceName={resourceName}
        className="mt-2"
      />
      <Popup
        {...props}
        icon={faPlus}
        title={title[resourceName] + " erstellen"}
        onClose={close}
        show={show}
        buttons={
          <>
            <CancelButton onClick={onClose} />
            <ConfirmCreateNewButton
              onClick={onConfirm}
              resource={resource}
              resourceName={resourceName}
              creating={creating}
              // disabled={disabled}
            />
          </>
        }
      >
        {children}
      </Popup>
    </>
  )
}

export default Popup

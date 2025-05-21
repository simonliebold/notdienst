import React from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { CardDeleteButton, ConfirmDeleteButton } from "./CardButton"
import { title } from "../variables"

function Popup({
  children,
  title,
  buttons,
  show = true,
  onRequestClose,
  onRequestShow,
  ...props
}) {
  return (
    <Modal show={show} onHide={onRequestClose} {...props}>
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
  resource,
  resourceName,
  ...props
}) => {
  return (
    <Popup
      {...props}
      title={title[resourceName] + " " + resource?.title + " löschen"}
      buttons={
        <ConfirmDeleteButton
          onClick={onConfirm}
          resource={resource}
          resourceName={resourceName}
          disabled
        />
      }
    />
  )
}

export default Popup

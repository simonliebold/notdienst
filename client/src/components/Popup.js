import React, { useCallback, useEffect, useState } from "react"
import FormControl from "react-bootstrap/FormControl"
import Modal from "react-bootstrap/Modal"
import {
  CancelButton,
  CardDeleteButton,
  ConfirmCreateNewButton,
  ConfirmDeleteButton,
  CreateNewButton,
  CredentialsButton,
} from "./CardButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey, faPlus, faTrash, faX } from "@fortawesome/free-solid-svg-icons"
import { localeString, localeStringTime, title } from "../variables"
import usePopup, { useDeletePopup } from "../hooks/useDelete"
import Badge from "./Badge"
import QRCode from "react-qr-code"

function Popup({ children, title, icon, buttons, show, onClose, ...props }) {
  return (
    <Modal show={show} onHide={onClose} {...props}>
      <Modal.Header closeButton>
        <Modal.Title>
          {icon && <FontAwesomeIcon icon={icon} size="xs" className="me-2" />}
          {title}
        </Modal.Title>
      </Modal.Header>
      {children && <Modal.Body>{children}</Modal.Body>}
      {buttons && <Modal.Footer>{buttons}</Modal.Footer>}
    </Modal>
  )
}

export const ConfirmDeletePopup = ({
  resource,
  show,
  close,
  submit,
  input,
  onInput,
  deleting,
}) => {
  return (
    <Popup
      show={show}
      onClose={close}
      title="Endgültig löschen bestätigen"
      buttons={
        <>
          <CancelButton onClick={close} />
          <ConfirmDeleteButton onClick={submit} deleting={deleting} />
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
            <CancelButton onClick={close} />
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

export const CredentialsTokenPopup = ({ employee }) => {
  const [show, setShow] = useState(false)

  const close = useCallback(() => {
    setShow(false)
  }, [show, setShow])

  const open = useCallback(() => {
    setShow(true)
  }, [show, setShow])

  const [result, setResult] = useState(null)

  const handleResult = useCallback((r) => {
    setResult(r)
    open()
  })

  const link = process.env.REACT_APP_SELF_URL + "credentials/" + result?.code

  return (
    <>
      <CredentialsButton userId={employee?._id} handleResult={handleResult} />
      <Popup
        title={
          <>
            <Badge
              resource={{ short: result?.code }}
              resourceName="credentialsToken"
              className="me-2"
              disabled
            />
            Account-Token
          </>
        }
        show={show}
        onClose={close}
      >
        <div className="row row-cols-1 row-cols-lg-2">
          <div>
            {"Name: " + employee?.title}
            <hr />
            {"Gültig bis: " +
              new Date(result?.expiresAt).toLocaleString(localeString)}
            <p>
              <a href={link}>{link}</a>
            </p>
          </div>
          <QRCode value={link} />
        </div>
      </Popup>
    </>
  )
}

export default Popup

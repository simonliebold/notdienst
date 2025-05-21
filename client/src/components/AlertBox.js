import React, { useEffect, useState } from "react"
import Alert from "react-bootstrap/Alert"
import { useAlert } from "../contexts/AlertContext"

function AlertBox() {
  const alert = useAlert()
  const [show, setShow] = useState(true)

  useEffect(() => {
    setShow(true)
  }, [alert])


  if (alert === undefined || !show) return

  return (
    <div
      id="alert-wrapper"
      className="d-flex flex-column position-absolute justify-content-start w-100"
      style={{ height: "100vh" }}
    >
      <Alert
        dismissible
        variant={alert.variant ? alert.variant : "danger"}
        className="z-1 mt-3"
        onClose={() => setShow(false)}
      >
        {alert.message && alert.message}
        {!alert.message && "Es ist ein Fehler aufgetreten"}
      </Alert>
    </div>
  )
}

export default AlertBox

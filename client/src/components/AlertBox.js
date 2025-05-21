import React, { useEffect, useState } from "react"
import Alert from "react-bootstrap/Alert"

function AlertBox({ alert }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    setShow(true)
  }, [alert])


  if (alert === null || !show) return null
  return (
    <div
      id="alertBox"
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

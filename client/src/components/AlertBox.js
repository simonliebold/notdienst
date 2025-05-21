import React, { useEffect, useState } from "react"
import { useAlert } from "../contexts/AlertContext"
import Alert from "react-bootstrap/Alert"
import Fade from "react-bootstrap/Fade"
import Container from "react-bootstrap/Container"

function AlertBox() {
  const alert = useAlert()
  const [show, setShow] = useState(true)

  useEffect(() => {
    setShow(true)
  }, [alert])

  if (alert === undefined || !show || !alert?.message) return

  return (
    <Container
      id="alert-wrapper"
      className="w-100 position-fixed mt-5 top-0 end-0 start-0"
      style={{ zIndex: 5000 }}
    >
      <Fade in={show}>
        <Alert
          dismissible
          variant={alert.variant ? alert.variant : "danger"}
          className="mt-3"
          onClose={() => setShow(false)}
        >
          {alert.message}
        </Alert>
      </Fade>
    </Container>
  )
}

export default AlertBox

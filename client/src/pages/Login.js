import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { useAuth, useAuthUpdate } from "../contexts/AuthContext"
import { useAlertUpdate } from "../contexts/AlertContext"

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import FloatingLabel from "react-bootstrap/FloatingLabel"

function Login() {
  const addAlert = useAlertUpdate()
  const token = useAuth()
  const setToken = useAuthUpdate()

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [isEmailInvalid, setIsEmailInvalid] = useState(false)
  const [isPassInvalid, setIsPassInvalid] = useState(false)

  const [validated, setValidated] = useState(false)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (email.length === 0) setIsEmailInvalid(true)
    else setIsEmailInvalid(false)

    if (password.length === 0) setIsPassInvalid(true)
    else setIsPassInvalid(false)
  }, [email, password])

  useEffect(() => {
    setIsEmailInvalid(false)
    setIsPassInvalid(false)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:4000/login", {
        email: email,
        password: password,
      })
      if (!response.data.accessToken) addAlert()
      setToken(response.data.accessToken)
      navigate("/")
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
      else addAlert(error.message)
    }
  }

  return (
    <div
      className="position-absolute d-flex flex-column row-cols-lg-2 justify-content-center w-100"
      style={{ height: "100vh" }}
    >
      <h1 className="mb-2 fw-bold">Login</h1>
      <p className="text-muted mb-4">
        Gib bitte deine Nutzerdaten ein, um dich einzuloggen.
      </p>
      <Form noValidate validated={validated} onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="email">
          <FloatingLabel
            controlId="email"
            label="E-Mail-Adresse"
            className="mb-3"
          >
            <Form.Control
              type="email"
              placeholder="E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={isEmailInvalid}
              required
            />
            <Form.Control.Feedback type="invalid">
              Bitte verwende eine korrekte E-Mail-Adresse
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <FloatingLabel controlId="password" label="Passwort" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Passwort"
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={isPassInvalid}
              required
            />
            <Form.Control.Feedback type="invalid">
              Bitte gib ein Passwort ein
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Button
          size="lg"
          type="submit"
          disabled={loading || isEmailInvalid || isPassInvalid}
        >
          {loading && <>Lädt...</>}
          {!loading && <>Daten ändern</>}
        </Button>
      </Form>
    </div>
  )
}

export default Login

import React, { useState } from "react"
import axios from "axios"
import { useNavigate, Navigate, Link } from "react-router-dom"

import {
  useAuth,
  useAuthUpdate,
  useRefreshToken,
  useRefreshTokenUpdate,
} from "../contexts/AuthContext"
import { useErrorMessage, useSuccessMessage } from "../contexts/AlertContext"

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import FloatingLabel from "react-bootstrap/FloatingLabel"

function Login() {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const token = useAuth()
  const setToken = useAuthUpdate()
  const setRefreshToken = useRefreshTokenUpdate()

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [isEmailInvalid, setIsEmailInvalid] = useState(false)
  const [isPassInvalid, setIsPassInvalid] = useState(false)

  const [validated, setValidated] = useState(false)

  const [loading, setLoading] = useState(false)

  const checkEmail = () => {
    if (email.length === 0) setIsEmailInvalid(true)
    else setIsEmailInvalid(false)
  }

  const checkPass = () => {
    if (password.length === 0) setIsPassInvalid(true)
    else setIsPassInvalid(false)
  }

  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault()
    const response = await axios
      .post(process.env.REACT_APP_AUTH_URL + "login", {
        email: email,
        password: password,
      })
      .catch(handleError)
    setLoading(false)
    if (!response?.data?.accessToken || !response?.data?.refreshToken) return
    setToken(response.data.accessToken)
    setRefreshToken(response.data.refreshToken)
    navigate("/")
  }

  if (token) return <Navigate to="/" />

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
              onChange={(e) => {
                setEmail(e.target.value)
                checkEmail()
              }}
              onBlur={checkEmail}
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
              onChange={(e) => {
                setPassword(e.target.value)
                checkPass()
              }}
              onBlur={checkPass}
              isInvalid={isPassInvalid}
              required
            />
            <Form.Control.Feedback type="invalid">
              Bitte gib ein Passwort ein
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <div className="d-flex align-items-center">
          <Button size="lg" type="submit" disabled={!password || !email}>
            Einloggen
          </Button>
          <p className="mb-0 ms-3 text-small">
            <Link to="/credentials" className="text-muted text-decoration-none">
              Passwort vergessen?
            </Link>
          </p>
        </div>
      </Form>
    </div>
  )
}

export default Login

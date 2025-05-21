import React, { useEffect, useState } from "react"
import axios from "axios"

import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      const response = await axios.post(process.env.AUTH_URL+"login", {})
      console.log(response)
    } catch (error) {
      // TODO: ERROR
    }
  }

  return (
    <div
      id="content"
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <h1 className="fs-3 mb-3">Login</h1>
      <div id="login">
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="E-Mail-Adresse"
            aria-label="E-Mail-Adresse"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Passwort"
            aria-label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
        <Button className="w-100" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  )
}

export default Login

import React, { useState, useRef, useEffect } from "react"
import axios from "axios"

import AuthCode from "react-auth-code-input"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Alert from "react-bootstrap/Alert"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

function EditCredentials({
  result,
  setLoggedIn,
  oldEmail,
  error,
  setError,
  setSuccess,
}) {
  const [email, setEmail] = useState(oldEmail)
  const [password, setPassword] = useState("")
  const [passwordRepeat, setPasswordRepeat] = useState("")

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    try {
      if (password !== passwordRepeat)
        return setError("Die eingegebenen Passwörter stimmen nicht überein.")

      const req = {}

      if (email.length > 0) req.email = email
      if (password.length > 0) req.password = password

      const res = await axios.post(
        "http://localhost:4000/credentials/change/" + result,
        req
      )
      console.log(res)
      if (res.status === 200) {
        setLoggedIn(false)
        setSuccess(res.data.message)
      }
    } catch (error) {
      setError(error.response.data.error)
      if (error.response.status === 404) setLoggedIn(false)
    }
  }

  useEffect(() => {
    setError("")
  }, [password, passwordRepeat])

  return (
    <>
      <Col>
        <div className="center d-flex flex-column justify-content-center">
          <h1 className="my-2">Account-Daten ändern</h1>
          <p className="text-secondary mb-4">
            Gib bitte die Daten ein, die geändert werden sollen.
          </p>
          {error.length > 0 && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleOnSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>E-Mail-Adresse</Form.Label>
              <Form.Control
                type="email"
                placeholder="E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Neues Passwort</Form.Label>
              <Form.Control
                type="password"
                placeholder="Passwort"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password-repeat">
              <Form.Label>Neues Passwort wiederholen</Form.Label>
              <Form.Control
                type="password"
                placeholder="Passwort wiederholen"
                onChange={(e) => setPasswordRepeat(e.target.value)}
              />
            </Form.Group>
            <Button type="submit">Daten ändern</Button>
          </Form>
        </div>
      </Col>
      <Col></Col>
    </>
  )
}

function InputCode({
  result,
  setResult,
  setLoggedIn,
  setOldEmail,
  error,
  setError,
  success,
}) {
  const handleOnChange = (res) => setResult(res)

  const [loading, setLoading] = useState(false)

  const AuthInputRef = useRef(null)

  useEffect(() => {
    setError("")
  }, [result])

  const handleOnSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const code = await axios.get(
        "http://localhost:4000/credentials/check/" + result
      )
      setOldEmail(code.data.email)
      setLoggedIn(true)
    } catch (error) {
      if (error.response.status === 404) {
        setError("Der eingegebene Code konnte nicht gefunden werden")
      }
    }
    setLoading(false)
  }

  return (
    <>
      <Col>
        <div className="center d-flex flex-column justify-content-center">
          <h1 className="mb-2">Code eingeben</h1>
          <p className="text-secondary mb-4">
            Um die Account-Daten zu ändern, gib bitte den sechsstelligen Code
            ein.
          </p>
          <form onSubmit={handleOnSubmit}>
            {error.length > 0 && <Alert variant="danger">{error}</Alert>}
            {success.length > 0 && <Alert variant="success">{success}</Alert>}
            <AuthCode
              inputClassName="signupinput"
              onChange={handleOnChange}
              ref={AuthInputRef}
            />
            {result.length === 6 && (
              <Button
                className="mt-3"
                size="lg"
                type="submit"
                disabled={loading}
              >
                {loading && <>Lädt...</>}
                {!loading && <>Bestätigen</>}
              </Button>
            )}
          </form>
        </div>
      </Col>
      <Col></Col>
    </>
  )
}

function SignUp() {
  const [result, setResult] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [oldEmail, setOldEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  return (
    <Container>
      <Row className="row-cols-1 row-cols-lg-2">
        {loggedIn && (
          <EditCredentials
            result={result}
            setLoggedIn={setLoggedIn}
            oldEmail={oldEmail}
            error={error}
            setError={setError}
            setSuccess={setSuccess}
          />
        )}
        {!loggedIn && (
          <InputCode
            result={result}
            setResult={setResult}
            setLoggedIn={setLoggedIn}
            setOldEmail={setOldEmail}
            error={error}
            setError={setError}
            success={success}
          />
        )}
      </Row>
    </Container>
  )
}

export default SignUp

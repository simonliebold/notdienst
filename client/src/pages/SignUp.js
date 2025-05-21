import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import AuthCode from "react-auth-code-input"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import AlertBox from "../components/AlertBox"
import { useAlert, useAlertUpdate } from "../contexts/AlertContext"

function EditCredentials({ result, setLoggedIn, oldEmail }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState(oldEmail)
  const [password, setPassword] = useState("")
  const [passwordRepeat, setPasswordRepeat] = useState("")

  const [validated, setValidated] = useState(false)

  const [loading, setLoading] = useState(false)

  const [isPassInvalid, setIsPassInvalid] = useState(false)
  const [isPassRepeatInvalid, setIsPassRepeatInvalid] = useState(false)
  const [isEmailInvalid, setIsEmailInvalid] = useState(false)

  const addAlert = useAlertUpdate()

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const req = {}

      if (email.length > 0) req.email = email
      if (password.length > 0) req.password = password

      const res = await axios.post(
        "http://localhost:4000/credentials/change/" + result,
        req
      )

      setLoggedIn(false)
      addAlert(res.data.message, "success")
    } catch (error) {
      if (error.response.data.error) addAlert(error.response.data.error)
      else addAlert(error.message)
      if (error.response.status === 404) {
        setLoggedIn(false)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    if (
      password.length > 0 &&
      !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    )
      setIsPassInvalid(true)
    else setIsPassInvalid(false)
    if (passwordRepeat !== password) setIsPassRepeatInvalid(true)
    else setIsPassRepeatInvalid(false)

    if (
      email.length === 0 ||
      !email
        .toLowerCase()
        .match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
    )
      setIsEmailInvalid(true)
    else setIsEmailInvalid(false)
  }, [password, passwordRepeat, email])

  return (
    <div className="">
      <h1 className="mb-2 fw-bold">Account-Daten ändern</h1>
      <p className="text-muted mb-4">
        Gib bitte die Daten ein, die geändert werden sollen.
      </p>
      <Form noValidate validated={validated} onSubmit={handleOnSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <FloatingLabel
            controlId="email"
            label="E-Mail-Adresse (Pflichtfeld)"
            className="mb-3"
          >
            <Form.Control
              type="email"
              placeholder="E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={isEmailInvalid}
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
            />
            <Form.Control.Feedback type="invalid">
              Das Passwort muss mindestens 8 Zeichen lang sein und einen
              Buchstaben und eine Nummer enthalten
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="" controlId="passwordRepeat">
          <FloatingLabel
            controlId="passwordRepeat"
            label="Passwort wiederholen"
            className="mb-4"
          >
            <Form.Control
              type="password"
              placeholder="Passwort wiederholen"
              onChange={(e) => {
                setPasswordRepeat(e.target.value)
              }}
              isInvalid={isPassRepeatInvalid}
            />
            <Form.Control.Feedback type="invalid">
              Die beiden Passwörter müssen übereinstimmen
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Button
          size="lg"
          type="submit"
          disabled={
            loading || isEmailInvalid || isPassInvalid || isPassRepeatInvalid
          }
        >
          {loading && <>Lädt...</>}
          {!loading && <>Daten ändern</>}
        </Button>
      </Form>
    </div>
  )
}

function InputCode({ result, setResult, setLoggedIn, setOldEmail }) {
  const handleOnChange = (res) => setResult(res)

  const [loading, setLoading] = useState(false)

  const AuthInputRef = useRef(null)
  const addAlert = useAlertUpdate()

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
        addAlert(error.response.data.error)
      } else {
        addAlert(error.message)
      }
    }
    setLoading(false)
  }

  return (
    <>
      <h1 className="mb-2 fw-bold">Code eingeben</h1>
      <p className="text-muted mb-4">
        Um die Account-Daten zu ändern, gib bitte den sechsstelligen Code ein.
      </p>
      <form onSubmit={handleOnSubmit}>
        <AuthCode
          inputClassName="signupinput"
          onChange={handleOnChange}
          ref={AuthInputRef}
          isInvalid={true}
        />
        <Button
          className="mt-4"
          size="lg"
          type="submit"
          disabled={loading || result.length !== 6}
        >
          {loading && <>Lädt...</>}
          {!loading && <>Bestätigen</>}
        </Button>
      </form>
    </>
  )
}

function SignUp() {
  const [result, setResult] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [oldEmail, setOldEmail] = useState("")

  return (
    <div
      className="position-absolute d-flex flex-column row-cols-lg-2 justify-content-center w-100"
      style={{ height: "100vh" }}
    >
      {loggedIn && (
        <EditCredentials
          result={result}
          oldEmail={oldEmail}
          setLoggedIn={setLoggedIn}
        />
      )}
      {!loggedIn && (
        <InputCode
          result={result}
          setResult={setResult}
          setLoggedIn={setLoggedIn}
          setOldEmail={setOldEmail}
        />
      )}
    </div>
  )
}

export default SignUp

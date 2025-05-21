import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import AuthCode from "react-auth-code-input"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import {
  useAlertUpdate,
  useErrorMessage,
  useSuccessMessage,
} from "../contexts/AlertContext"

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

  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const req = {}

    if (email.length > 0) req.email = email
    if (password.length > 0) req.password = password

    const res = await axios
      .post(
        process.env.REACT_APP_AUTH_URL + "credentials/change/" + result,
        req
      )
      .catch(handleError)

    if (res?.data?.message) {
      handleSuccess(res.data.message)
      navigate("/login")
    }

    setLoading(false)
  }

  useEffect(() => {
    if (password.length > 0 && !password.match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/))
      setIsPassInvalid(true)
    else setIsPassInvalid(false)
    if (passwordRepeat !== password) setIsPassRepeatInvalid(true)
    else setIsPassRepeatInvalid(false)

    if (
      email === null ||
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
      <h1 className="mb-2 fw-bold mb-4">Account-Daten festlegen</h1>
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
          <FloatingLabel
            controlId="password"
            label="Neues Passwort"
            className="mb-3"
          >
            <Form.Control
              type="password"
              placeholder="Neues Passwort"
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
            label="Neues Passwort wiederholen"
            className="mb-4"
          >
            <Form.Control
              type="password"
              placeholder="Neues Passwort wiederholen"
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
          {!loading && <>Account-Daten speichern</>}
        </Button>
      </Form>
    </div>
  )
}

function InputCode({ result, setResult, setLoggedIn, setOldEmail }) {
  const [loading, setLoading] = useState(false)

  const AuthInputRef = useRef(null)
  const handleError = useErrorMessage()

  useEffect(() => {
    if (result) checkCode()
  }, [])

  const handleOnChange = (res) => setResult(res)

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    checkCode()
  }

  const checkCode = async () => {
    setLoading(true)
    const code = await axios
      .get(process.env.REACT_APP_AUTH_URL + "credentials/check/" + result)
      .catch(handleError)
    if (code?.data?.email) {
      setOldEmail(code.data.email)
      setLoggedIn(true)
    }

    setLoading(false)
  }

  return (
    <>
      <h1 className="mb-2 fw-bold">Code eingeben</h1>
      <p className="text-muted mb-4">
        Um die Account-Daten zu ändern, gib bitte den vierstelligen Code ein.
      </p>
      <form onSubmit={handleOnSubmit}>
        <AuthCode
          inputClassName="signupinput"
          onChange={handleOnChange}
          ref={AuthInputRef}
          isInvalid={true}
          length={4}
        />
        <Button
          className="mt-4"
          size="lg"
          type="submit"
          disabled={loading || result.length !== 4}
        >
          {loading && <>Lädt...</>}
          {!loading && <>Bestätigen</>}
        </Button>
      </form>
    </>
  )
}

function Credentials() {
  const { code } = useParams()
  const [result, setResult] = useState(code || "")
  const [loggedIn, setLoggedIn] = useState(false)
  const [oldEmail, setOldEmail] = useState("")

  return (
    <div
      className="position-absolute d-flex flex-column row-cols-lg-2 justify-content-center w-100 align-items-center align-items-lg-start text-center text-lg-start"
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

export default Credentials

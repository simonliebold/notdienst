import React from "react"
import ReactDOM from "react-dom/client"
import "./style.scss"
import App from "./App"
import { BrowserRouter } from "react-router-dom"

// TODO: add auth:
// https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/
// https://www.npmjs.com/package/react-jwt

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </React.StrictMode>
)

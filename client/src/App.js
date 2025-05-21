import React from "react"
import { Routes, Route } from "react-router-dom"

import { AuthProvider } from "./contexts/AuthContext"
import { AlertProvider } from "./contexts/AlertContext"

import Prot from "./routes/Prot"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Credentials from "./pages/Credentials"
import Container from "react-bootstrap/esm/Container"
import AlertBox from "./components/AlertBox"
import Logout from "./pages/Logout"
import Elements from "./pages/admin/Elements"
import Works from "./pages/admin/Works"
import Employees from "./pages/admin/Employees"
import Employment from "./pages/admin/Employment"

function App() {
  const home = (
    <Prot>
      <Home />
    </Prot>
  )

  const elements = (
    <Prot>
      <Elements />
    </Prot>
  )

  const logout = (
    <Prot>
      <Logout />
    </Prot>
  )

  const works = (
    <Prot>
      <Works />
    </Prot>
  )

  const employees = (
    <Prot>
      <Employees />
    </Prot>
  )

  const employments = (
    <Prot>
      <Employment />
    </Prot>
  )

  return (
    <AuthProvider>
      <AlertProvider>
        <Container>
          <div className="position-relative">
            <AlertBox />
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="credentials">
                <Route path="" element={<Credentials />} />
                <Route path=":code" element={<Credentials />} />
              </Route>
              <Route path="" element={home} />
              <Route path="elements" element={elements} />
              <Route path="logout" element={logout} />
              <Route path="works" element={works} />
              <Route path="employees" element={employees} />
              <Route path="employments" element={employments} />
            </Routes>
          </div>
        </Container>
      </AlertProvider>
    </AuthProvider>
  )
}

export default App

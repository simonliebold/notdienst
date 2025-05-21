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
import Employments from "./pages/admin/Employments"
import Freetimes from "./pages/admin/Freetimes"
import Jobs from "./pages/admin/Jobs"
import Rrules from "./pages/admin/Rrules"
import Schedules from "./pages/admin/Schedules"
import Shifts from "./pages/admin/Shifts"

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
      <Employments />
    </Prot>
  )

  const freetimes = (
    <Prot>
      <Freetimes />
    </Prot>
  )

  const jobs = (
    <Prot>
      <Jobs />
    </Prot>
  )

  const rrules = (
    <Prot>
      <Rrules />
    </Prot>
  )

  const schedules = (
    <Prot>
      <Schedules />
    </Prot>
  )

  const shifts = (
    <Prot>
      <Shifts />
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
              <Route path="freetimes" element={freetimes} />
              <Route path="jobs" element={jobs} />
              <Route path="rrules" element={rrules} />
              <Route path="schedules" element={schedules} />
              <Route path="shifts" element={shifts} />
            </Routes>
          </div>
        </Container>
      </AlertProvider>
    </AuthProvider>
  )
}

export default App

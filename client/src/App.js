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
import Works from "./pages/admin/Works"
import Employees from "./pages/admin/Employees"
import Employments from "./pages/admin/Employments"
import Freetimes from "./pages/admin/Freetimes"
import Jobs from "./pages/admin/Jobs"
import Rrules from "./pages/admin/Rrules"
import Schedules from "./pages/admin/Schedules"
import Shifts from "./pages/admin/Shifts"
import Missions from "./pages/admin/Missions"
import {
  EmployeePage,
  EmploymentPage,
  FreetimePage,
  JobPage,
  MissionPage,
  RrulePage,
  SchedulePage,
  ShiftPage,
  WorkPage,
} from "./pages/admin/ResourcePage"

function App() {
  const home = (
    <Prot>
      <Home />
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

  const missions = (
    <Prot>
      <Missions />
    </Prot>
  )

  const schedule = (
    <Prot>
      <SchedulePage />
    </Prot>
  )

  const freetime = (
    <Prot>
      <FreetimePage />
    </Prot>
  )

  const work = (
    <Prot>
      <WorkPage />
    </Prot>
  )

  const shift = (
    <Prot>
      <ShiftPage />
    </Prot>
  )

  const rrule = (
    <Prot>
      <RrulePage />
    </Prot>
  )

  const employee = (
    <Prot>
      <EmployeePage />
    </Prot>
  )

  const job = (
    <Prot>
      <JobPage />
    </Prot>
  )

  const employment = (
    <Prot>
      <EmploymentPage />
    </Prot>
  )

  const mission = (
    <Prot>
      <MissionPage />
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
              <Route path="logout" element={logout} />

              <Route path="schedules" element={schedules} />
              <Route path="schedules/:id" element={schedule} />

              <Route path="freetimes" element={freetimes} />
              <Route path="freetimes/:id" element={freetime} />

              <Route path="works" element={works} />
              <Route path="works/:id" element={work} />

              <Route path="shifts" element={shifts} />
              <Route path="shifts/:id" element={shift} />

              <Route path="rrules" element={rrules} />
              <Route path="rrules/:id" element={rrule} />

              <Route path="employees" element={employees} />
              <Route path="employees/:id" element={employee} />

              <Route path="jobs" element={jobs} />
              <Route path="jobs/:id" element={job} />

              <Route path="employments" element={employments} />
              <Route path="employments/:id/" element={employment} />

              <Route path="missions" element={missions} />
              <Route path="missions/:id/" element={mission} />
            </Routes>
          </div>
        </Container>
      </AlertProvider>
    </AuthProvider>
  )
}

export default App

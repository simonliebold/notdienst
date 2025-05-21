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
import { ScheduleDetailedCard } from "./components/DetailedCard"
import Schedule from "./pages/admin/Schedule"
import Freetime from "./pages/admin/Freetime"
import Work from "./pages/admin/Work"
import Shift from "./pages/admin/Shift"
import Rrule from "./pages/admin/Rrule"
import Employee from "./pages/admin/Employee"
import Job from "./pages/admin/Job"
import Employment from "./pages/admin/Employment"
import Missions from "./pages/admin/Missions"
import Mission from "./pages/admin/Mission"

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

  const schedule = (
    <Prot>
      <Schedule />
    </Prot>
  )

  const freetime = (
    <Prot>
      <Freetime />
    </Prot>
  )

  const work = (
    <Prot>
      <Work />
    </Prot>
  )

  const shift = (
    <Prot>
      <Shift />
    </Prot>
  )

  const rrule = (
    <Prot>
      <Rrule />
    </Prot>
  )

  const employee = (
    <Prot>
      <Employee />
    </Prot>
  )

  const job = (
    <Prot>
      <Job />
    </Prot>
  )

  const employment = (
    <Prot>
      <Employment />
    </Prot>
  )

  const missions = (
    <Prot>
      <Missions />
    </Prot>
  )

  const mission = (
    <Prot>
      <Mission />
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

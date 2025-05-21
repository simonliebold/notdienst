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
import {
  EmployeePage,
  EmploymentPage,
  ExchangePage,
  FreetimePage,
  JobPage,
  MissionPage,
  RrulePage,
  SchedulePage,
  ShiftPage,
  WorkPage,
} from "./pages/admin/ResourcePage"
import {
  EmployeesPage,
  EmploymentsPage,
  ExchangesPage,
  FreetimesPage,
  JobsPage,
  MissionsPage,
  RrulesPage,
  SchedulesPage,
  ShiftsPage,
  WorksPage,
} from "./pages/admin/ResourcesPage"

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

  const resources = {
    works: (
      <Prot>
        <WorksPage />
      </Prot>
    ),
    employees: (
      <Prot>
        <EmployeesPage />
      </Prot>
    ),
    employments: (
      <Prot>
        <EmploymentsPage />
      </Prot>
    ),
    freetimes: (
      <Prot>
        <FreetimesPage />
      </Prot>
    ),
    jobs: (
      <Prot>
        <JobsPage />
      </Prot>
    ),
    rrules: (
      <Prot>
        <RrulesPage />
      </Prot>
    ),
    schedules: (
      <Prot>
        <SchedulesPage />
      </Prot>
    ),
    shifts: (
      <Prot>
        <ShiftsPage />
      </Prot>
    ),
    missions: (
      <Prot>
        <MissionsPage />
      </Prot>
    ),
    exchanges: (
      <Prot>
        <ExchangesPage />
      </Prot>
    ),
  }

  const resource = {
    schedule: (
      <Prot>
        <SchedulePage />
      </Prot>
    ),

    freetime: (
      <Prot>
        <FreetimePage />
      </Prot>
    ),

    work: (
      <Prot>
        <WorkPage />
      </Prot>
    ),

    shift: (
      <Prot>
        <ShiftPage />
      </Prot>
    ),

    rrule: (
      <Prot>
        <RrulePage />
      </Prot>
    ),

    employee: (
      <Prot>
        <EmployeePage />
      </Prot>
    ),

    job: (
      <Prot>
        <JobPage />
      </Prot>
    ),

    employment: (
      <Prot>
        <EmploymentPage />
      </Prot>
    ),

    mission: (
      <Prot>
        <MissionPage />
      </Prot>
    ),
    exchange: (
      <Prot>
        <ExchangePage />
      </Prot>
    ),
  }

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

              <Route path="schedules" element={resources.schedules} />
              <Route path="schedules/:id" element={resource.schedule} />

              <Route path="freetimes" element={resources.freetimes} />
              <Route path="freetimes/:id" element={resource.freetime} />

              <Route path="works" element={resources.works} />
              <Route path="works/:id" element={resource.work} />

              <Route path="shifts" element={resources.shifts} />
              <Route path="shifts/:id" element={resource.shift} />

              <Route path="rrules" element={resources.rrules} />
              <Route path="rrules/:id" element={resource.rrule} />

              <Route path="employees" element={resources.employees} />
              <Route path="employees/:id" element={resource.employee} />

              <Route path="jobs" element={resources.jobs} />
              <Route path="jobs/:id" element={resource.job} />

              <Route path="employments" element={resources.employments} />
              <Route path="employments/:id/" element={resource.employment} />

              <Route path="missions" element={resources.missions} />
              <Route path="missions/:id/" element={resource.mission} />

              <Route path="exchanges" element={resources.exchanges} />
              <Route path="exchanges/:id/" element={resource.exchange} />
            </Routes>
          </div>
        </Container>
      </AlertProvider>
    </AuthProvider>
  )
}

export default App

import React from "react"
import { Routes, Route } from "react-router-dom"

import { AuthProvider } from "./contexts/AuthContext"
import { AlertProvider } from "./contexts/AlertContext"

import ProtectedRoute from "./routes/ProtectedRoute"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Credentials from "./pages/Credentials"
import Container from "react-bootstrap/esm/Container"
import AlertBox from "./components/AlertBox"
import Employees from "./pages/Employees"

function App() {
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
              <Route
                path=""
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="employees">
                <Route
                  path=""
                  element={
                    <ProtectedRoute>
                      <Employees />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":employeeInitials"
                  element={
                    <ProtectedRoute>
                      <Employees />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </div>
        </Container>
      </AlertProvider>
    </AuthProvider>
  )
}

export default App

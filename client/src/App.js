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
import Navigation from "./components/Navigation"

function App() {
  const routes = [
    { name: "Home", path: "/", protected: true, element: <Home /> },
    { name: "Login", path: "/login", protected: false, element: <Login /> },
    {
      name: "Credentials",
      path: "/credentials",
      protected: false,
      element: <Credentials />,
    },
  ]

  return (
    <AuthProvider>
      <AlertProvider>
        <Container>
          <div className="position-relative">
            <AlertBox />

            <Routes>
              {routes.map((route) => {
                if (route.protected)
                  return (
                    <Route
                      path={route.path}
                      element={
                        <ProtectedRoute>
                          <Navigation routes={routes} />
                          {route.element}
                        </ProtectedRoute>
                      }
                    />
                  )
                else return <Route path={route.path} element={route.element} />
              })}
            </Routes>
          </div>
        </Container>
      </AlertProvider>
    </AuthProvider>
  )
}

export default App

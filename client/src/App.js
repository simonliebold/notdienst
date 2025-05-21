import React, { useEffect, useMemo } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { useLocalStorage } from "./hooks/useLocalStorage"

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useLocalStorage("user", null)

  const login = async (data) => {
    setUser(data);
    navigate("/profile");
  };

  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App

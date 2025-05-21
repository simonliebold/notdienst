import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()
const AuthUpdateContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}
export const useAuthUpdate = () => {
  return useContext(AuthUpdateContext)
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token
      localStorage.setItem("token", token)
    } else {
      delete axios.defaults.headers.common["Authorization"]
      localStorage.removeItem("token")
    }
  }, [token])

  return (
    <AuthContext.Provider value={token}>
      <AuthUpdateContext.Provider value={setToken}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}

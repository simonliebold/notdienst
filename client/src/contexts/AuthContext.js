import axios from "axios"
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"

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

  useLayoutEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token
      axios.defaults.headers.post["Authorization"] = "Bearer " + token
      localStorage.setItem("token", token)
    } else {
      delete axios.defaults.headers.common["Authorization"]
      delete axios.defaults.headers.post["Authorization"]
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

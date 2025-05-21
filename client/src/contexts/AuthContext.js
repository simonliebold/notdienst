import { createContext, useContext, useLayoutEffect, useState } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext()
const AuthUpdateContext = createContext()
const RefreshTokenContext = createContext()
const RefreshTokenUpdateContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}
export const useAuthUpdate = () => {
  return useContext(AuthUpdateContext)
}
export const useRefreshToken = () => {
  return useContext(RefreshTokenContext)
}
export const useRefreshTokenUpdate = () => {
  return useContext(RefreshTokenUpdateContext)
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"))
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  )

  useLayoutEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      // console.log(decoded)
      axios.defaults.headers.common["Authorization"] = "Bearer " + token
      axios.defaults.headers.post["Authorization"] = "Bearer " + token
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("accessToken", token)
    } else {
      delete axios.defaults.headers.common["Authorization"]
      delete axios.defaults.headers.post["Authorization"]
      localStorage.removeItem("refreshToken", refreshToken)
      localStorage.removeItem("accessToken")
    }
  }, [token])

  return (
    <AuthContext.Provider value={token}>
      <AuthUpdateContext.Provider value={setToken}>
        <RefreshTokenContext.Provider value={refreshToken}>
          <RefreshTokenUpdateContext.Provider value={setRefreshToken}>
            {children}
          </RefreshTokenUpdateContext.Provider>
        </RefreshTokenContext.Provider>
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}

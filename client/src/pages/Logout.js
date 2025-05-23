import axios from "axios"
import React, { useEffect } from "react"
import {
  useAuthUpdate,
  useRefreshToken,
  useRefreshTokenUpdate,
} from "../contexts/AuthContext"
import { useErrorMessage, useSuccessMessage } from "../contexts/AlertContext"

function Logout() {
  const refreshToken = useRefreshToken()
  const setRefreshToken = useRefreshTokenUpdate()
  const setToken = useAuthUpdate()
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()
  useEffect(() => {
    async function logout() {
      const response = await axios
        .delete(process.env.REACT_APP_AUTH_URL + "logout", {
          data: {
            token: refreshToken,
          },
        })
        .catch(handleError)
      if (!response?.status === 204) return
      handleSuccess("Erfolgreich ausgeloggt")
      setToken()
      setRefreshToken()
    }
    logout()
  }, [setToken, handleError, handleSuccess, refreshToken, setRefreshToken])
  return <div>Logout</div>
}

export default Logout

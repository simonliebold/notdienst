import { createContext, useContext, useState } from "react"
import { useAuthUpdate, useRefreshToken } from "./AuthContext"
import axios from "axios"

const AlertContext = createContext()
const ErrorMessageContext = createContext()
const SuccessMessageContext = createContext()

export const useAlert = () => {
  return useContext(AlertContext)
}

export const useErrorMessage = () => {
  return useContext(ErrorMessageContext)
}

export const useSuccessMessage = () => {
  return useContext(SuccessMessageContext)
}

export const AlertProvider = ({ children }) => {
  const setToken = useAuthUpdate()
  const refreshToken = useRefreshToken()
  const [alert, setAlert] = useState(undefined)

  const handleSuccess = (message) => {
    setAlert({ message: message, variant: "success" })
  }

  const handleError = async (error) => {
    if (error.response?.status === 401) {
      const response = await axios
        .post(process.env.REACT_APP_AUTH_URL + "token", {
          token: refreshToken,
        })
        .catch(handleError)
      if (response?.data?.accessToken) setToken(response.data.accessToken)
      else setToken()
      return
    }
    if (error.response?.status === 403) {
      setAlert({
        message: error.response?.data?.error,
        variant: "danger",
      })
      setToken()
      return
    }

    if (error.response?.data?.error)
      return setAlert({
        message: error.response?.data?.error,
        variant: "danger",
      })
  }
  return (
    <AlertContext.Provider value={alert}>
      <SuccessMessageContext.Provider value={handleSuccess}>
        <ErrorMessageContext.Provider value={handleError}>
          {children}
        </ErrorMessageContext.Provider>
      </SuccessMessageContext.Provider>
    </AlertContext.Provider>
  )
}

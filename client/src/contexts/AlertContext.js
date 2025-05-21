import { createContext, useContext, useState } from "react"
import { useAuthUpdate } from "./AuthContext"

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
  const [alert, setAlert] = useState(undefined)

  const handleSuccess = (message) => {
    setAlert({ message: message, variant: "success" })
  }

  const handleError = (error) => {
    if (error.response?.status === 401) {
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

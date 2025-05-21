import { createContext, useContext, useState } from "react"

const AlertContext = createContext()
const AlertUpdateContext = createContext()

export const useAlert = () => {
  return useContext(AlertContext)
}

export const useAlertUpdate = () => {
  return useContext(AlertUpdateContext)
}

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(undefined)

  const addAlert = (message, variant) => {
    setAlert({ message: message, variant: variant })
  }
  return (
    <AlertContext.Provider value={alert}>
      <AlertUpdateContext.Provider value={addAlert}>
        {children}
      </AlertUpdateContext.Provider>
    </AlertContext.Provider>
  )
}

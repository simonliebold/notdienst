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
  const [alerts, setAlerts] = useState(null)

  const addAlert = (message, variant) => {
    setAlerts({ message: message, variant: variant })
  }
  return (
    <AlertContext.Provider value={alerts}>
      <AlertUpdateContext.Provider value={addAlert}>
        {children}
      </AlertUpdateContext.Provider>
    </AlertContext.Provider>
  )
}

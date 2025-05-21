import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Navigation from "../components/Navigation"

const ProtectedRoute = ({ children }) => {
  const token = useAuth()

  if (!token) return <Navigate to="/login" />

  return (
    <>
      <Navigation />
      {children}
    </>
  )
}

export default ProtectedRoute

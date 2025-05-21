import React from "react"
import { useUser } from "../contexts/AuthContext"
import { EmployeeCalendar } from "../components/Calendar"

function Home() {
  const user = useUser()
  return (
    <div className="">
      <h1 className="mt-3 text-center">Hallo, {user?.title}! 👋</h1>
      <br />
      <h2>Deine Dienste:</h2>
      <EmployeeCalendar employee={user} />
    </div>
  )
}

export default Home

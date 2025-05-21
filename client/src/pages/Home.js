import React from "react"
import { useUser } from "../contexts/AuthContext"

function Home() {
  const user = useUser()
  return (
    <div className="">
      <h1 className="mt-3 text-center">Willkommen, {user?.title}! 👋</h1>
    </div>
  )
}

export default Home

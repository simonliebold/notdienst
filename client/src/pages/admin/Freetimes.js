import React from "react"
import useResource from "../../hooks/useResource"
import ResourcesPage from "./ResourcesPage"

function Freetimes() {
  const [freetimes] = useResource("freetimes")

  return <ResourcesPage resources={freetimes} resourceName="freetime" />
}

export default Freetimes

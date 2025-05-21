import React from "react"
import Badge from "../../components/Badge"
import { faHashtag, faUser } from "@fortawesome/free-solid-svg-icons"
import TitleCard from "../../components/TitleCard"
import DetailedCard from "../../components/DetailedCard"

function Elements() {
  return (
    <>
      <h2>Badge</h2>
      <Badge
        icon={faHashtag}
        resource={{ short: 201 }}
        // resourceName=""
        className=""
      />
      <h2>TitleCard</h2>
      <TitleCard
        resource={{ id: 256, short: "OKT 2023", title: "Oktober 2023" }}
        resourceName={"schedule"}
      />
      <h2>DetailedCard</h2>
      <DetailedCard
        resource={{ id: 256, short: "OKT 2023", title: "Oktober 2023" }}
        resourceName={"schedule"}
      />
    </>
  )
}

export default Elements

import React from "react"
import Badge from "../../components/Badge"
import { faHashtag, faUser } from "@fortawesome/free-solid-svg-icons"
import TitleCard from "../../components/TitleCard"
import DetailedCard from "../../components/DetailedCard"
import MultiBadge from "../../components/MultiBadge"

function Elements() {
  return (
    <>
      <h2>Badge</h2>
      <Badge
        resource={{ id: 201, short: 201 }}
        // resourceName="employee"
        className=""
      />
      <h2>TitleCard</h2>
      <TitleCard
        resource={{ id: 256, short: "OKT 23", title: "Oktober 2023" }}
        resourceName={"schedule"}
      />
      <h2>DetailedCard</h2>
      <DetailedCard
        resource={{ id: 256, short: "Nov 23", title: "Oktober 2023" }}
        resourceName={"schedule"}
      >
        <MultiBadge
          items={[
            { id: 1, short: "LBD" },
            { id: 2, short: "PAP" },
            { id: 3, short: "ESH" },
            { id: 4, short: "EWE" },
            { id: 5, short: "MÜL" },
          ]}
          resourceName="employee"
          />
      </DetailedCard>
    </>
  )
}

export default Elements

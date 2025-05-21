import React from "react"
import Badge from "../../components/Badge"
import { faHashtag, faUser } from "@fortawesome/free-solid-svg-icons"
import TitleCard from "../../components/TitleCard"
import DetailedCard, {
  EmployeeDetailedCard,
} from "../../components/DetailedCard"
import MultiBadge from "../../components/MultiBadge"

function Elements() {
  return (
    <>
      <h2>Badge</h2>
      <Badge resource={{ id: 201, short: 201 }} className="" />
      <h2>TitleCard</h2>
      <TitleCard
        resource={{ id: 256, short: "OKT 23", title: "Oktober 2023" }}
        resourceName={"schedule"}
      />
      <h2>DetailedCard</h2>
      <EmployeeDetailedCard
        employee={{
          id: 256,
          short: "LBD",
          title: "Simon Paul Liebold",
          works: [
            { id: 46411, short: 46411, title: "fe" },
            { id: 46412, short: 46412, title: "fe" },
            { id: 46414, short: 46414, title: "fe" },
            { id: 46415, short: 46415, title: "fe" },
            { id: 46416, short: 46416, title: "fe" },
            { id: 46419, short: 46419, title: "fe" },
            { id: 464110, short: 464110, title: "fe" },
            { id: 464111, short: 464111, title: "fe" },
            { id: 464113, short: 464113, title: "fe" },
            { id: 464114, short: 464114, title: "fe" },
            { id: 464119, short: 464119, title: "fe" },
            { id: 464120, short: 464120, title: "fe" },
          ],
          employmentId: 5,
          employment: {
            id: 5,
            short: "TEIL",
            title: "Teilzeit",
          },
        }}
      />
    </>
  )
}

export default Elements

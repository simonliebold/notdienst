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
            { id: 1, short: 1, title: "fe" },
            { id: 2, short: 2, title: "fe" },
            { id: 3, short: 3, title: "fe" },
            { id: 4, short: 4, title: "fe" },
            { id: 5, short: 5, title: "fe" },
            { id: 6, short: 6, title: "fe" },
            { id: 7, short: 7, title: "fe" },
            { id: 8, short: 8, title: "fe" },
            { id: 9, short: 9, title: "fe" },
            { id: 10, short: 10, title: "fe" },
            { id: 11, short: 11, title: "fe" },
            { id: 12, short: 12, title: "fe" },
            { id: 13, short: 13, title: "fe" },
            { id: 14, short: 14, title: "fe" },
            { id: 15, short: 15, title: "fe" },
            { id: 16, short: 16, title: "fe" },
            { id: 17, short: 17, title: "fe" },
            { id: 18, short: 18, title: "fe" },
            { id: 19, short: 19, title: "fe" },
            { id: 20, short: 20, title: "fe" },
          ],
        }}
      />
    </>
  )
}

export default Elements

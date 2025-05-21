import React from "react"
import Badge from "../../components/Badge"
import { faHashtag, faUser } from "@fortawesome/free-solid-svg-icons"
import TitleCard from "../../components/TitleCard"

function Elements() {
  return (
    <>
      <h2>Badge</h2>
      <Badge icon={faHashtag} className="">
        201
      </Badge>
      <h2>TitleCard</h2>
      <TitleCard
        icon={faUser}
        resource={{ id: 256, short: "OKT 2023", title: "Oktober 2023" }}
      />
    </>
  )
}

export default Elements

import React from "react"
import Badge from "../../components/Badge"
import { faHashtag, faUser } from "@fortawesome/free-solid-svg-icons"

function Elements() {
  return (
    <>
      <h2>Badge</h2>
      <Badge icon={faHashtag} className="">
        201
      </Badge>
    </>
  )
}

export default Elements

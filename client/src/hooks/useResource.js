import React, { useEffect, useState } from "react"
import axios from "axios"
import { useErrorMessage, useSuccessMessage } from "./../contexts/AlertContext"

const useResource = (resourceUrl) => {
  const handleError = useErrorMessage()

  const get = async () => {
    const response = await axios
      .get(process.env.REACT_APP_URL + resourceUrl)
      .catch(handleError)
    if (process.env.NODE_ENV === "development")
      console.log("FETCH", resourceUrl + ":", response?.data)

    return response?.data
  }

  return get
}

export const useResourceUpdate = (resourceUrl) => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const update = async (updatedData) => {
    const response = await axios
      .put(process.env.REACT_APP_URL + resourceUrl, updatedData)
      .catch(handleError)
    if (process.env.NODE_ENV === "development")
      console.log("PUT", resourceUrl + ":", updatedData)

    handleSuccess(response?.data?.message)
    return response?.data?.message
  }

  return update
}
// TODO: create update resource api call

export default useResource

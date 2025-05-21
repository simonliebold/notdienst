import React, { useEffect, useState } from "react"
import axios from "axios"
import { useErrorMessage } from "./../contexts/AlertContext"

const useResource = (resourceUrl) => {
  const handleError = useErrorMessage()
  const [resource, setResource] = useState(null)
  const getData = async () => {
    const response = await axios
      .get(process.env.REACT_APP_URL + resourceUrl)
      .catch(handleError)
    if (process.env.NODE_ENV === "development")
      console.log(resourceUrl + ":", response?.data)
    setResource(response?.data)
  }

  useEffect(() => {
    getData()
  }, [resourceUrl])

  return resource
}

export default useResource

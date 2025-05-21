import React, { useEffect, useState } from "react"
import axios from "axios"
import { useErrorMessage } from "./../contexts/AlertContext"

const useResource = (resourceUrl) => {
  const handleError = useErrorMessage()
  const [resource, setResource] = useState(null)
  const getData = async () => {
    console.log("drtfzguhji")
    const response = await axios
      .get(process.env.REACT_APP_URL + resourceUrl)
      // .catch(handleError)
    console.log(resourceUrl + ":", response?.data)
    setResource(response?.data)
  }

  useEffect(() => {
    getData()
  }, [resourceUrl])

  return resource
}

export default useResource

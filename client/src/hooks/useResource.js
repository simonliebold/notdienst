import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { useErrorMessage, useSuccessMessage } from "./../contexts/AlertContext"

const useResource = (resourceUrl) => {
  const handleError = useErrorMessage()
  const [data, setData] = useState(null)

  const update = useCallback(async () => {
    const response = await axios
      .get(process.env.REACT_APP_URL + resourceUrl)
      .catch(handleError)
    if (process.env.NODE_ENV === "development")
      console.log("FETCH", resourceUrl + ":", response?.data)

    setData(response?.data)
  }, [handleError, resourceUrl])

  useEffect(() => {
    update()
  }, [resourceUrl, update])

  return [data, update]
}

export const useResourceUpdate = (resourceUrl) => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const update = useCallback(
    async (updatedData) => {
      const response = await axios
        .put(process.env.REACT_APP_URL + resourceUrl, updatedData)
        .catch(handleError)
      if (process.env.NODE_ENV === "development")
        console.log(
          "PUT",
          resourceUrl,
          updatedData,
          ":",
          response?.data?.message
        )

      handleSuccess(response?.data?.message)
      return response?.data?.message
    },
    [handleError, handleSuccess, resourceUrl]
  )

  return update
}

export const useResourceDelete = (resourceUrl) => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const destroy = useCallback(async () => {
    const response = await axios
      .delete(process.env.REACT_APP_URL + resourceUrl)
      .catch(handleError)
    if (process.env.NODE_ENV === "development")
      console.log("DELETE:", resourceUrl, response?.data?.message)

    // handleSuccess(response?.data?.message)
    return response?.data?.message
  }, [handleError, handleSuccess, resourceUrl])

  return destroy
}

export const useResourceCreate = (resourceUrl) => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const create = useCallback(
    async (data) => {
      const response = await axios
        .post(process.env.REACT_APP_URL + resourceUrl, data)
        .catch(handleError)
      if (process.env.NODE_ENV === "development")
        console.log("CREATE:", resourceUrl, response?.data)

      // handleSuccess(response?.data?.message)
      return response?.data
    },
    [handleError, handleSuccess, resourceUrl]
  )

  return create
}

export default useResource

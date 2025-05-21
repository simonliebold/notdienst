import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { useErrorMessage, useSuccessMessage } from "./../contexts/AlertContext"

const useResource = (resourceUrl) => {
  const handleError = useErrorMessage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const update = useCallback(async () => {
    setLoading(true)
    const response = await axios
      .get(process.env.REACT_APP_URL + resourceUrl)
      .catch(handleError)
    if (process.env.NODE_ENV === "development")
      console.log("useResource", resourceUrl + ":", response)

    setData(response?.data)
    setLoading(false)
  }, [resourceUrl])

  useEffect(() => {
    update()
  }, [resourceUrl, update])

  return [data, update, loading]
}

export const useResourceUpdate = (resourceUrl) => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const [loading, setLoading] = useState(false)

  const update = useCallback(
    async (updatedData) => {
      setLoading(true)
      const response = await axios
        .put(process.env.REACT_APP_URL + resourceUrl, updatedData)
        .catch(handleError)
      if (process.env.NODE_ENV === "development")
        console.log(
          "useResourceUpdate",
          resourceUrl,
          updatedData,
          ":",
          response
        )

      handleSuccess(response?.data?.message)
      setLoading(false)
      return response?.data?.message
    },
    [handleError, handleSuccess, resourceUrl]
  )

  return [update, loading]
}

export const useResourceDelete = (resourceUrl) => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()
  const [loading, setLoading] = useState(false)

  const destroy = useCallback(async () => {
    setLoading(true)
    const response = await axios
      .delete(process.env.REACT_APP_URL + resourceUrl)
      .catch(handleError)
    if (process.env.NODE_ENV === "development")
      console.log("useResourceDelete:", resourceUrl, response?.data?.message)

    setLoading(false)
    // handleSuccess(response?.data?.message)
    return response?.data?.message
  }, [handleError, handleSuccess, resourceUrl])

  return [destroy, loading]
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
        console.log("useResourceCreate:", resourceUrl, data, response)

      // handleSuccess(response?.data?.message)
      return response?.data
    },
    [handleError, handleSuccess, resourceUrl]
  )

  return create
}

export const useGenerateWorks = () => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const generate = useCallback(
    async (scheduleId) => {
      if (!scheduleId) return
      const response = await axios
        .post(process.env.REACT_APP_URL + "schedules/" + scheduleId + "/create")
        .catch(handleError)
      if (process.env.NODE_ENV === "development")
        console.log("useGenerateWorks:", response?.data)

      // handleSuccess(response?.data?.message)
      return response?.data
    },
    [handleError, handleSuccess]
  )

  return generate
}

export const useAllocateWorks = (linear = true) => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const url = linear ? "/allocate"  : "/allocate2"

  const allocate = useCallback(
    async (scheduleId) => {
      if (!scheduleId) return
      const response = await axios
        .post(
          process.env.REACT_APP_URL + "schedules/" + scheduleId + url
        )
        .catch(handleError)
      if (process.env.NODE_ENV === "development")
        console.log("useAllocateWorks:", response?.data)

      handleSuccess(response?.data?.message)
      return response?.data
    },
    [handleError, handleSuccess]
  )

  return allocate
}

export const useDeleteWorks = () => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const deleteWorks = useCallback(
    async (scheduleId) => {
      if (!scheduleId) return
      const response = await axios
        .delete(process.env.REACT_APP_URL + "schedules/" + scheduleId + "/works")
        .catch(handleError)
      if (process.env.NODE_ENV === "development")
        console.log("useDeleteWorks:", response?.data)

      handleSuccess(response?.data?.message)
      return response?.data
    },
    [handleError, handleSuccess]
  )

  return deleteWorks
}

export const useCreateReport = () => {
  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const createReport = useCallback(
    async (scheduleId) => {
      if (!scheduleId) return
      const response = await axios
        .get(process.env.REACT_APP_URL + "schedules/" + scheduleId + "/report")
        .catch(handleError)
      if (process.env.NODE_ENV === "development")
        console.log("useCreateReport:", response?.data)

      handleSuccess(response?.data?.message)
      return response?.data
    },
    [handleError, handleSuccess]
  )

  return createReport
}

export const useGenerateCredentialsToken = () => {
  const handleError = useErrorMessage()

  const generate = useCallback(
    async (userId) => {
      if (!userId) return
      const response = await axios
        .post(process.env.REACT_APP_AUTH_URL + "credentials/generate/" + userId)
        .catch(handleError)
      if (process.env.NODE_ENV === "development")
        console.log("useGenerateCredentialsToken:", response?.data)
      return response?.data
    },
    [handleError]
  )
  return generate
}

export const useUserResource = () => {
  const handleError = useErrorMessage()
  const [user, setUser] = useState(null)

  const fetch = useCallback(
    async (userId) => {
      const response = await axios
        .get(process.env.REACT_APP_URL + "employees/" + userId)
        .catch(handleError)

      setUser(response?.data)
      if (process.env.NODE_ENV === "development")
        console.log("useUserResource:", response?.data)
      return response?.data
    },
    [handleError]
  )

  return [user, fetch]
}

export default useResource

import axios from "axios"
import React, { useCallback, useEffect, useState } from "react"
import Select from "react-select"
import { useErrorMessage, useSuccessMessage } from "../contexts/AlertContext"
import Button from "react-bootstrap/esm/Button"

// TODO: stop input from reloading after every submit (move getting default values into component)
// TODO: add loading state
function MultiSelect({ valueType, objectType, objectId, defaultValues }) {
  const [options, setOptions] = useState([])
  const [defaults, setDefaults] = useState([])
  const [values, setValues] = useState([])

  const handleError = useErrorMessage()
  const handleSuccess = useSuccessMessage()

  const fetchOptions = useCallback(async () => {
    const res = await axios
      .get(process.env.REACT_APP_URL + valueType)
      .catch(handleError)

    setOptions(
      res?.data?.values.map((value) => {
        return { value: value.id, label: value.title }
      })
    )
  }, [handleError, valueType])

  const updateValues = useCallback(async () => {
    const res = await axios
      .put(
        process.env.REACT_APP_URL +
          objectType +
          "/" +
          objectId +
          "/" +
          valueType,
        { values: values.map((val) => val.value) }
      )
      .catch(handleError)

    if (res?.data?.message) handleSuccess(res.data.message)
  }, [handleError, handleSuccess, objectId, objectType, valueType, values])

  useEffect(() => {
    const newDefaults = defaultValues?.map((value) => {
      return { value: value.id, label: value.title }
    })
    setDefaults(newDefaults)
    setValues(newDefaults)
    fetchOptions()
  }, [defaultValues, fetchOptions])

  let disabled = useCallback(() => {
    const sortedValues = values
      ?.map((data) => data.value)
      .sort()
      .toString()

    const sortedDefault = defaults
      ?.map((data) => data.value)
      .sort()
      .toString()

    return sortedValues === sortedDefault
  }, [values, defaults])

  if (!defaults || !values || !options) return <Select isDisabled isLoading />

  return (
    <div className="d-flex align-items-end">
      <Select
        defaultValue={defaults}
        options={options}
        values={values}
        onChange={setValues}
        name={valueType}
        isMulti
        className="basic-multi-select flex-fill"
        classNamePrefix="select"
      />
      {!disabled() && (
        <Button className="ms-3" onClick={updateValues}>
          Speichern
        </Button>
      )}
    </div>
  )
}

export default MultiSelect

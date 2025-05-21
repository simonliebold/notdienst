import axios from "axios"
import React, { useCallback, useEffect, useState } from "react"
import Select from "react-select"
import { useErrorMessage, useSuccessMessage } from "../contexts/AlertContext"
import Button from "react-bootstrap/esm/Button"
import useResource from "../hooks/useResource"

// TODO: stop input from reloading after every submit (move getting default values into component)
function MultiSelect({ items, resourceName }) {
  const defaults = useResource(resourceName + "s/")

  if (!defaults || !values || !options)
    return <Select isDisabled isLoading placeholder="Aktualisiert..." />

  return (
    <Select
      defaultValue={defaults}
      options={options}
      values={items.map((item) => ({ value: item.id, label: item.short }))}
      // onChange={setValues}
      name={valueType}
      isLoading={saving}
      isDisabled={saving}
      placeholder="Auswählen..."
      isMulti
      className="basic-multi-select flex-fill"
      classNamePrefix="select"
    />
  )
}

export default MultiSelect

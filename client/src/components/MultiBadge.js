import React, { useEffect, useState } from "react"
import Badge from "./Badge"
import Select from "react-select"
import useResource from "../hooks/useResource"
import { icons, selectStyles, titles } from "../variables"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function MultiBadge({
  items,
  resourceName,
  customName,
  onInput,
  disabled,
  className,
  edit,
}) {
  const [options, updateOptions] = useResource(resourceName + "s")

  const [name, setName] = useState(customName)
  useEffect(() => {
    if (customName) setName(customName)
    else setName(resourceName)
  }, [customName, resourceName])

  useEffect(() => {
    updateOptions()
  }, [resourceName, updateOptions])

  const onChange = (items) => {
    if (onInput)
      onInput(
        name + "Ids",
        items.map((item) => {
          return item.value
        })
      )
  }

  if (disabled && edit)
    return (
      <div className={"mb-3 " + className}>
        <label className="w-100">{titles[name]}:</label>
        {items?.map((item) => {
          const { short, _id } = item || {}
          return (
            <Badge
              key={short + "-" + _id + "-badge"}
              resource={item}
              resourceName={resourceName}
              className="me-1 mb-1"
              disabled
            />
          )
        })}
      </div>
    )

  if (edit) {
    return (
      <div className={"mb-3 " + className}>
        <label className="w-100">{titles[name]}:</label>
        <Select
          isMulti
          getOptionLabel={(option) => (
            <>
              <FontAwesomeIcon
                icon={icons[resourceName] || icons.default}
                className="me-2"
              />
              {option.label}
            </>
          )}
          placeholder="Keine Daten"
          noOptionsMessage={() => "Keine Optionen"}
          styles={selectStyles}
          options={options?.map((option) => ({
            // resourceName: resourceName,
            label: option.short,
            value: option._id,
          }))}
          defaultValue={items?.map((item) => ({
            // resourceName: resourceName,
            label: item.short,
            value: item._id,
          }))}
          onChange={onChange}
        />
      </div>
    )
  }
  if (!items || items?.length === 0)
    return (
      <div className={"mb-3 " + className}>
        <label className="w-100">{titles[name]}:</label>
        <Badge resource={{ short: "Keine Daten" }} disabled />
      </div>
    )
  return (
    <div className={"mb-3 " + className}>
      <label className="w-100">{titles[name]}:</label>
      {items?.map((item) => {
        const { short, _id } = item || {}
        return (
          <Badge
            key={short + "-" + _id + "-badge"}
            resource={item}
            resourceName={resourceName}
            className="me-1 mb-1"
          />
        )
      })}
    </div>
  )
}

export default MultiBadge

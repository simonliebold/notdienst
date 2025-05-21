import {
  faArrowDownShortWide,
  faCalendarDays,
  faCalendarPlus,
  faCancel,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faExpand,
  faFile,
  faKey,
  faPen,
  faPlus,
  faSave,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useCallback, useEffect, useState } from "react"
import Button from "react-bootstrap/esm/Button"
import { Link } from "react-router-dom"
import { icons, title, titles } from "../variables"
import Spinner from "react-bootstrap/esm/Spinner"
import {
  useAllocateWorks,
  useCreateReport,
  useDeleteWorks,
  useGenerateCredentialsToken,
  useGenerateWorks,
} from "../hooks/useResource"
import Placeholder from "react-bootstrap/Placeholder"

function CardButton({ icon, children, ...props }) {
  return (
    <Button {...props}>
      {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
      {children}
    </Button>
  )
}

const LoadingButton = ({ children, ...props }) => {
  return (
    <Placeholder.Button {...props}>
      <Spinner animation="border" role="status" size={"sm"} className="me-2" />
      {children}
    </Placeholder.Button>
  )
}

function CardButtonLink({ to, ...props }) {
  return <CardButton as={Link} to={to} {...props} />
}

export const CardEditButton = ({ ...props }) => {
  return (
    <CardButton icon={faPen} variant="primary" {...props}>
      Bearbeiten
    </CardButton>
  )
}

export const CardDeleteButton = ({ className, ...props }) => {
  return (
    <CardButton
      variant="link"
      icon={faTrash}
      className={"text-decoration-none text-secondary " + className}
      {...props}
    >
      Löschen
    </CardButton>
  )
}

export const CardSaveButton = ({ ...props }) => {
  return (
    <CardButton variant="primary" icon={faSave} {...props}>
      Speichern
    </CardButton>
  )
}

export const ConfirmDeleteButton = ({ deleting, ...props }) => {
  if (deleting) return <LoadingButton variant="danger">Löscht...</LoadingButton>
  return (
    <CardButton variant="danger" icon={faTrash} {...props}>
      Endgültig löschen
    </CardButton>
  )
}

export const CancelButton = ({ ...props }) => {
  return (
    <CardButton variant="link text-decoration-none text-secondary" {...props}>
      Abbrechen
    </CardButton>
  )
}

export const CreateNewButton = ({ resourceName, ...props }) => {
  return (
    <CardButton
      icon={faPlus}
      variant="link text-decoration-none text-secondary"
      {...props}
    >
      {title[resourceName] + " erstellen"}
    </CardButton>
  )
}
// TODO: disabled when creating,
export const ConfirmCreateNewButton = ({
  resource,
  resourceName,
  creating,
  ...props
}) => {
  return (
    <CardButton variant="primary" icon={faPlus} disabled={creating} {...props}>
      {creating && "Erstellt..."}
      {!creating && title[resourceName] + " erstellen"}
    </CardButton>
  )
}

export const AsyncGenerateWorksButton = ({
  schedule,
  updateResource,
  edit,
  ...props
}) => {
  const generate = useGenerateWorks()

  const generateWorks = useCallback(async () => {
    await generate(schedule?._id)
    await updateResource()
  }, [generate])

  if (schedule?.works?.length !== 0) return

  return (
    <CardButton {...props} icon={faCalendarPlus} onClick={generateWorks}>
      {titles.work + " generieren"}
    </CardButton>
  )
}

export const AsyncAllocateWorksButton = ({
  schedule,
  updateResource,
  edit,
  ...props
}) => {
  const allocate = useAllocateWorks()
  const [loading, setLoading] = useState(false)

  const allocateWorks = useCallback(async () => {
    setLoading(true)
    await allocate(schedule?._id)
    await updateResource()
    setLoading(false)
  }, [allocate, schedule, updateResource])

  if (schedule?.works?.length == 0) return

  if (loading)
    return (
      <LoadingButton>{title.schedule + " wird generiert..."}</LoadingButton>
    )

  return (
    <CardButton
      {...props}
      icon={faCalendarDays}
      disabled={edit}
      variant="primary"
      onClick={allocateWorks}
    >
      {"Dienste verteilen"}
    </CardButton>
  )
}


export const AsyncDeleteWorksButton = ({
  schedule,
  updateResource,
  edit,
  ...props
}) => {
  const deleteWorks = useDeleteWorks() // Assuming a hook for deleting works exists
  const [loading, setLoading] = useState(false)

  const handleDeleteWorks = useCallback(async () => {
    setLoading(true)
    await deleteWorks(schedule?._id)
    await updateResource()
    setLoading(false)
  }, [deleteWorks, schedule, updateResource])

  if (schedule?.works?.length == 0) return

  if (loading)
    return <LoadingButton>{title.schedule + " wird gelöscht..."}</LoadingButton>

  return (
    <CardButton
      {...props}
      icon={faTrash}
      disabled={edit}
      variant="danger"
      onClick={handleDeleteWorks}
    >
      {"Dienste löschen"}
    </CardButton>
  )
}


export const AsyncCreateReportButton = ({
  schedule,
  updateResource,
  edit,
  ...props
}) => {
  const createReport = useCreateReport()
  const [loading, setLoading] = useState(false)

  const handleCreateReport = useCallback(async () => {
    setLoading(true)
    await createReport(schedule?._id)
    setLoading(false)
  }, [createReport, schedule, updateResource])

  if (schedule?.works?.length == 0) return

  if (loading)
    return <LoadingButton>{title.schedule + " wird gelöscht..."}</LoadingButton>

  return (
    <CardButton
      {...props}
      icon={faFile}
      disabled={edit}
      variant="primary"
      onClick={handleCreateReport}
    >
      Bericht generieren
    </CardButton>
  )
}

export const ExpandButton = ({ expanded, ...props }) => {
  return (
    <CardButton
      icon={expanded ? faCaretDown : faCaretLeft}
      variant="link"
      className="text-decoration-none text-secondary p-0"
      {...props}
    ></CardButton>
  )
}

export const CredentialsButton = ({ userId, handleResult }) => {
  const generate = useGenerateCredentialsToken()

  const [loading, setLoading] = useState(false)

  const handleGenerate = useCallback(async () => {
    setLoading(true)
    const result = await generate(userId)
    handleResult(result)
    setLoading(false)
  }, [generate, handleResult, userId])

  if (loading) return <LoadingButton>{"Token wird generiert..."}</LoadingButton>
  return (
    <CardButton icon={faKey} onClick={handleGenerate}>
      Token generieren
    </CardButton>
  )
}

export default CardButton

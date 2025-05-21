import axios from "axios"
import React, { useEffect, useState } from "react"
import { useErrorMessage } from "../contexts/AlertContext"
import Col from "react-bootstrap/esm/Col"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import Badge from "react-bootstrap/esm/Badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import Row from "react-bootstrap/esm/Row"

const ScheduleItem = ({ schedule }) => {
  console.log(schedule)
  return (
    <Col>
      <Card>
        <Card.Body
          as={Link}
          to={"/schedules/" + schedule.id}
          className="text-decoration-none"
        >
          <Badge className="me-2">
            <FontAwesomeIcon icon={faCalendar} className="me-1" />
            {schedule.id}
          </Badge>
          {schedule.title}
        </Card.Body>
      </Card>
    </Col>
  )
}

function Schedules() {
  const [schedules, setSchedules] = useState()

  const handleError = useErrorMessage()

  const fetchSchedules = async () => {
    const res = await axios
      .get(process.env.REACT_APP_URL + "schedules")
      .catch(handleError)
    setSchedules(res?.data?.schedules)
  }
  useEffect(() => {
    fetchSchedules()
  }, [])

  // useEffect(async () => {fetchSchedules()}, [])
  return (
    <>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4 mt-0 align-items-stretch">
        {schedules?.map((schedule) => {
          return <ScheduleItem schedule={schedule} />
        })}
      </Row>
    </>
  )
}

export default Schedules

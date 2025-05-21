import React, { useCallback, useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import deLocale from "@fullcalendar/core/locales/de"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import Badge, { EditableBadge } from "./Badge"
import MultiBadge from "./MultiBadge"
import { AsyncAllocateWorksButton } from "./CardButton"
import { useNavigate } from "react-router-dom"

const event = (arg) => {
  const props = arg?.event?.extendedProps

  return (
    <div className="">
      {props?.work?.title}
      <br />
      {props?.work?.employees?.map((employee) => {
        return (
          <Badge
            key={"event-" + arg.id + "-employee-" + employee.id}
            resource={employee}
            resourceName="employee"
            className="me-1"
          />
        )
      })}
    </div>
  )
}

function Calendar({ works, view, initialDate, ...props }) {
  const navigate = useNavigate()

  const initialView = useCallback(() => {
    if (window.innerWidth < 992) {
      return view || "listDay"
    } else {
      return "timeGridWeek"
    }
  }, [window.innerWidth])

  if (!works) return <MultiBadge resourceName="work" />

  return (
    <div {...props}>
      <FullCalendar
        {...props}
        plugins={[timeGridPlugin, listPlugin]}
        initialView={initialView()}
        headerToolbar={{
          right: "prev,next",
        }}
        firstDay={1}
        height={"auto"}
        initialDate={initialDate}
        allDaySlot={false}
        eventClick={(e) => navigate("./../../works/" + e.event.id)}
        events={works.map((work) => {
          return {
            id: work._id,
            start: work.start,
            end: work.end,
            title: work.short,
            // color: "#fff",
            work: work,
            // abcd: "rcftvgzh"
          }
        })}
        locale="de"
        eventContent={event}
      />
    </div>
  )
}

export const ScheduleCalendar = ({
  schedule,
  edit,
  updateResource,
  ...props
}) => {
  const initialDate = useCallback(() => {
    if (!schedule?.works) return
    const first = new Date(schedule.works[0]?.start).getTime()
    const last = new Date(
      schedule.works[schedule.works.length - 1]?.start
    ).getTime()
    const today = new Date().getTime()
    if (today > last) return last
    if (today < last && today > first) return today
    return first
  }, [schedule])

  if (!schedule) return
  if (!schedule.works || schedule.works.length === 0) return

  return (
    <Calendar
      works={schedule.works}
      initialDate={initialDate()}
      className="my-3"
      {...props}
    />
  )
}

export const EmployeeCalendar = ({ employee, ...props }) => {
  const [lastDate, setLastDate] = useState(new Date())
  const [firstDate, setFirstDate] = useState(new Date())
  const [workHours, setWorkHours] = useState(0)

  useEffect(() => {
    console.log("First date", firstDate)
    console.log("Last date", lastDate)
    console.log(workHours)
  }, [firstDate, lastDate, workHours])

  useEffect(() => {
    if (employee?.works) {
      // Filter works within the date range
      const filteredWorks = employee.works.filter((work) => {
        const workStart = new Date(work.start)
        const workEnd = new Date(work.end)
        return workStart >= firstDate && workEnd <= lastDate
      })

      // Calculate total work hours
      const totalHours = filteredWorks.reduce((sum, work) => {
        const workStart = new Date(work.start)
        const workEnd = new Date(work.end)
        const hours = (workEnd - workStart) / (1000 * 60 * 60) // Convert milliseconds to hours
        return sum + hours
      }, 0)

      setWorkHours(totalHours)
    }
  }, [firstDate, lastDate, employee?.works])

  if (!employee) return
  if (!employee.works || employee.works.length === 0) return
  return (
    <>
      {/* <h1>Stunden: {employee?.employment?.minHours} ≤ {workHours} ≤ {employee?.employment?.maxHours}</h1> */}
      <Calendar
        works={employee.works}
        view="listMonth"
        datesSet={(dateInfo) => {
          setFirstDate(new Date(dateInfo.start))
          setLastDate(new Date(dateInfo.end))
        }}
        initialDate={
          new Date(employee.works[employee.works.length - 1].start) ||
          new Date()
        }
        className="my-3"
        {...props}
      />
    </>
  )
}

export default Calendar

import React, { useCallback, useState } from "react"
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
        //   {...props}
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
            id: work.id,
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
  }, [])

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
  if (!employee) return
  if (!employee.works || employee.works.length === 0) return
  return (
    <Calendar
      works={employee.works}
      view="listMonth"
      initialDate={new Date()}
      className="my-3"
      {...props}
    />
  )
}

export default Calendar

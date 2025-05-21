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

function Calendar({ works, view, ...props }) {
  const navigate = useNavigate()
  const initialView = useCallback(() => {
    if (window.innerWidth < 992) {
      return "listDay"
    } else {
      return "timeGridWeek"
    }
  }, [window.innerWidth])

  if (!works) return <MultiBadge resourceName="work" />
  return (
    <FullCalendar
      //   {...props}
      plugins={[timeGridPlugin, listPlugin]}
      initialView={initialView()}
      headerToolbar={{
        right: "prev,next",
        // left: "timeGridWeek,timeGridDay,listWeek",
      }}
      views={{
        three: {
          type: "timeGrid",
          duration: { days: 3 },
        },
      }}
      // buttonText={{
      //   today: "Heute",
      //   month: "Monat",
      //   week: "Woche",
      //   day: "Tag",
      //   list: "Liste",
      // }}
      height={"auto"}
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
  )
}

export const ScheduleCalendar = ({
  schedule,
  edit,
  updateResource,
  ...props
}) => {
  if (!schedule) return
  if (!schedule.works || schedule.works.length === 0) return
  return (
    <div className="mt-4">
      <Calendar works={schedule?.works} view="timeGridWeek" {...props} />
    </div>
  )
}

export default Calendar

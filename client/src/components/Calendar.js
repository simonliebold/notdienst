import React from "react"
import FullCalendar from "@fullcalendar/react"
import deLocale from "@fullcalendar/core/locales/de"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import Badge, { EditableBadge } from "./Badge"
import MultiBadge from "./MultiBadge"
import { AsyncAllocateWorksButton } from "./CardButton"
import { useNavigate } from "react-router-dom"

function Calendar({ works, view, ...props }) {
  const navigate = useNavigate()
  if (!works) return <MultiBadge resourceName="work" />
  return (
    <FullCalendar
      //   {...props}
      plugins={[timeGridPlugin, listPlugin]}
      initialView={view ? view : "listWeek"}
      headerToolbar={{
        right: "prev,next",
        left: "timeGridWeek,timeGridDay,listWeek",
        //  center: "title",
        // left: "",
      }}
      footerToolbar={
        {
          // right: "today,prev,next",
          // center: "title",
        }
      }
      buttonText={{
        today: "Heute",
        month: "Monat",
        week: "Woche",
        day: "Tag",
        list: "Liste",
      }}
      height={"80vh"}
      allDaySlot={false}
      eventClick={(e) => navigate("./../../works/" + e.event.id)}
      events={works.map((work) => {
        return {
          start: work.start,
          end: work.end,
          title:
            work.short + " " + work.employees.map((employee) => employee.title),
          id: work.id,
        }
      })}
      locale="de"
      // eventContent={renderEventContent}
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
  if (!schedule.works || schedule.works.length === 0)
    return (
      <div className="mt-4">
        
      </div>
    )
  return (
    <div className="mt-4">
      <Calendar works={schedule?.works} view="timeGridWeek" {...props} />
    </div>
  )
}

export default Calendar

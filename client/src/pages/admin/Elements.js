import React from "react"
import Badge from "../../components/Badge"
import { faHashtag, faUser } from "@fortawesome/free-solid-svg-icons"
import TitleCard from "../../components/TitleCard"
import DetailedCard, {
  EmployeeDetailedCard,
  ScheduleDetailedCard,
} from "../../components/DetailedCard"
import MultiBadge from "../../components/MultiBadge"

function Elements() {
  return (
    <>
      <h2>Badge</h2>
      <Badge resource={{ id: 201, short: 201 }} className="" />
      <hr />
      <h2>TitleCard</h2>
      <TitleCard
        resource={{ id: 256, short: "OKT 23", title: "Oktober 2023" }}
        resourceName={"schedule"}
      />
      <hr />
      <h2>EmployeeDetailedCard</h2>
      <EmployeeDetailedCard
        employee={{
          id: 256,
          short: "LBD",
          title: "Simon Paul Liebold",
          works: [
            { id: 46411, short: 46411, title: "fe" },
            { id: 46412, short: 46412, title: "fe" },
            { id: 46414, short: 46414, title: "fe" },
            { id: 46415, short: 46415, title: "fe" },
            { id: 46416, short: 46416, title: "fe" },
            { id: 46419, short: 46419, title: "fe" },
            { id: 464110, short: 464110, title: "fe" },
            { id: 464111, short: 464111, title: "fe" },
            { id: 464113, short: 464113, title: "fe" },
            { id: 464114, short: 464114, title: "fe" },
            { id: 464119, short: 464119, title: "fe" },
            { id: 464120, short: 464120, title: "fe" },
          ],
          employmentId: 5,
          employment: {
            id: 5,
            short: "TEIL",
            title: "Teilzeit",
          },
        }}
      />
      <hr />
      <h2>ScheduleDetailedCard</h2>
      <ScheduleDetailedCard
        schedule={{
          "id": 1,
          "short": "NOV 23",
          "title": "November 2023",
          "start": "2023-10-01",
          "end": "2023-10-31",
          "deadline": "2023-10-29T00:00:00.000Z",
          "employees": [
            {
              "id": 1,
              "short": "BEC",
              "title": "Markus Becker",
              "employmentId": 1,
              "schedules_employees": {
                "scheduleId": 1,
                "employeeId": 1
              }
            },
            {
              "id": 2,
              "short": "HZF",
              "title": "Jörn Hezfig",
              "employmentId": 2,
              "schedules_employees": {
                "scheduleId": 1,
                "employeeId": 2
              }
            },
            {
              "id": 3,
              "short": "WEW",
              "title": "Max Wewel",
              "employmentId": 3,
              "schedules_employees": {
                "scheduleId": 1,
                "employeeId": 3
              }
            }
          ],
          "shifts": [
            {
              "id": 1,
              "short": "A1 früh",
              "title": "A1 früh",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 1
              }
            },
            {
              "id": 2,
              "short": "A2 früh",
              "title": "A2 früh",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 2
              }
            },
            {
              "id": 3,
              "short": "A1 spät",
              "title": "A1 spät",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 3
              }
            },
            {
              "id": 4,
              "short": "A2 spät",
              "title": "A2 spät",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 4
              }
            },
            {
              "id": 5,
              "short": "A1 Nacht",
              "title": "A1 Nacht",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 5
              }
            },
            {
              "id": 6,
              "short": "A2 Nacht",
              "title": "A2 Nacht",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 6
              }
            },
            {
              "id": 7,
              "short": "C1 früh",
              "title": "C1 früh",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 7
              }
            },
            {
              "id": 8,
              "short": "C2 früh",
              "title": "C2 früh",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 8
              }
            },
            {
              "id": 9,
              "short": "C1 spät",
              "title": "C1 spät",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 9
              }
            },
            {
              "id": 10,
              "short": "C2 spät",
              "title": "C2 spät",
              "schedules_shifts": {
                "scheduleId": 1,
                "shiftId": 10
              }
            }
          ],
          "works": [
            {
              "short": 1,
              "title": "RRULE-1",
              "id": 1,
              "start": "2024-01-01T09:00:00.000Z",
              "end": "2024-01-01T14:00:00.000Z",
              "rruleId": 1,
              "scheduleId": 1,
              "employees": []
            }
          ]
        }}
      />{" "}
    </>
  )
}

export default Elements

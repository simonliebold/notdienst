module.exports = async (models) => {
  // const names = [
  //   ["Simon Liebold", 1],
  //   ["Tom Rerucha", 1],
  //   ["Michael Wagner", 3],
  //   ["Laura Fischer", 3],
  //   ["Markus Becker", 2],
  //   ["Sarah Hoffmann", 3],
  //   ["Julia Weber", 2],
  //   ["Thomas Richter", 2],
  //   ["Christine Lehmann", 1],
  //   ["Sabine Keller", 1],
  //   ["David Braun", 1],
  //   ["Nicole Huber", 2],
  //   ["Martin Wolf", 2],
  //   ["Monika Herrmann", 2],
  //   ["Richard Krüger", 1],
  //   ["Doris Landwehr", 1],
  //   ["Peter Kurz", 1],
  // ]
  // const generateEmployees = () => {
  //   let employees = []
  //   for (let i = 0; i < names.length; i++) {
  //     const name = names[i][0].split(" ")
  //     const kuerzel = name[1].slice(0, 3).toUpperCase()
  //     const employmentId = names[i][1]

  //     const employeeData = {
  //       initials: kuerzel,
  //       name: `${name[0]} ${name[1]}`,
  //       employmentId: employmentId,
  //     }
  //     employees.push(employeeData)
  //   }

  //   return employees
  // }

  const jobs = [
    { title: "ÄNoD Fahrer/-in" },
    { title: "EZ Dispo" },
    { title: "MTD / HNR Fahrer/-in" },
    { title: "RH" },
    { title: "RS" },
    { title: "SH" },
    { title: "NFS" },
  ]

  await models.Job.bulkCreate(jobs)

  const employments = [
    {
      title: "Minijob",
      maxHours: 40,
    },
    {
      title: "Teilzeit",
      minHours: 80,
    },
    {
      title: "Vollzeit",
      minHours: 160,
      maxHours: 180,
    },
  ]

  await models.Employment.bulkCreate(employments)

  // let employees = await generateEmployees()
  // employees = await models.Employee.bulkCreate(employees)

  let shifts = [
    { title: "A1 früh" },
    { title: "A2 früh" },
    { title: "A1 spät" },
    { title: "A2 spät" },
    { title: "A1 Nacht" },
    { title: "A2 Nacht" },
    { title: "C1 früh" },
    { title: "C2 früh" },
    { title: "C1 spät" },
    { title: "C2 spät" },
  ]

  shifts = await models.Shift.bulkCreate(shifts)

  let events = [
    {
      title: "A1 früh Samstag",
      timeStart: "08:00",
      timeEnd: "19:00",
      repeatWeekday: 6,
      shiftId: 1,
    },
    {
      title: "A1 früh Sonntag",
      timeStart: "08:00",
      timeEnd: "19:00",
      repeatWeekday: 0,
      shiftId: 1,
    },
    {
      title: "A2 früh Samstag",
      timeStart: "08:00",
      timeEnd: "19:00",
      repeatWeekday: 6,
      shiftId: 2,
    },
    {
      title: "A2 früh Sonntag",
      timeStart: "08:00",
      timeEnd: "19:00",
      repeatWeekday: 0,
      shiftId: 2,
    },
    {
      title: "A1 spät Mittwoch",
      timeStart: "13:00",
      timeEnd: "19:00",
      repeatWeekday: 3,
      shiftId: 3,
    },
    {
      title: "A1 spät Freitag",
      timeStart: "13:00",
      timeEnd: "19:00",
      repeatWeekday: 5,
      shiftId: 3,
    },
    {
      title: "A2 spät Mittwoch",
      timeStart: "13:00",
      timeEnd: "19:00",
      repeatWeekday: 3,
      shiftId: 4,
    },
    {
      title: "A2 spät Freitag",
      timeStart: "13:00",
      timeEnd: "19:00",
      repeatWeekday: 5,
      shiftId: 4,
    },
    {
      title: "A1 Nacht Montag",
      timeStart: "18:00",
      timeEnd: "08:00",
      repeatWeekday: 1,
      shiftId: 5,
    },
    {
      title: "A1 Nacht Dienstag",
      timeStart: "18:00",
      timeEnd: "08:00",
      repeatWeekday: 2,
      shiftId: 5,
    },
    {
      title: "A1 Nacht Donnerstag",
      timeStart: "18:00",
      timeEnd: "08:00",
      repeatWeekday: 4,
      shiftId: 5,
    },
    {
      title: "A1 Nacht Mittwoch",
      timeStart: "19:00",
      timeEnd: "08:00",
      repeatWeekday: 3,
      shiftId: 5,
    },
    {
      title: "A1 Nacht Freitag",
      timeStart: "19:00",
      timeEnd: "08:00",
      repeatWeekday: 5,
      shiftId: 5,
    },
    {
      title: "A1 Nacht Samstag",
      timeStart: "19:00",
      timeEnd: "08:00",
      repeatWeekday: 6,
      shiftId: 5,
    },
    {
      title: "A1 Nacht Sonntag",
      timeStart: "19:00",
      timeEnd: "08:00",
      repeatWeekday: 0,
      shiftId: 5,
    },
    {
      title: "A2 Nacht Montag",
      timeStart: "18:00",
      timeEnd: "08:00",
      repeatWeekday: 1,
      shiftId: 6,
    },
    {
      title: "A2 Nacht Dienstag",
      timeStart: "18:00",
      timeEnd: "08:00",
      repeatWeekday: 2,
      shiftId: 6,
    },
    {
      title: "A2 Nacht Donnerstag",
      timeStart: "18:00",
      timeEnd: "08:00",
      repeatWeekday: 4,
      shiftId: 6,
    },
    {
      title: "A2 Nacht Mittwoch",
      timeStart: "19:00",
      timeEnd: "08:00",
      repeatWeekday: 3,
      shiftId: 6,
    },
    {
      title: "A2 Nacht Freitag",
      timeStart: "19:00",
      timeEnd: "08:00",
      repeatWeekday: 5,
      shiftId: 6,
    },
    {
      title: "A2 Nacht Samstag",
      timeStart: "19:00",
      timeEnd: "08:00",
      repeatWeekday: 6,
      shiftId: 6,
    },
    {
      title: "A2 Nacht Sonntag",
      timeStart: "19:00",
      timeEnd: "08:00",
      repeatWeekday: 0,
      shiftId: 6,
    },
    {
      title: "C1 früh Samstag",
      timeStart: "08:00",
      timeEnd: "16:00",
      repeatWeekday: 6,
      shiftId: 7,
    },
    {
      title: "C1 früh Sonntag",
      timeStart: "08:00",
      timeEnd: "16:00",
      repeatWeekday: 0,
      shiftId: 7,
    },
    {
      title: "C2 früh Samstag",
      timeStart: "08:00",
      timeEnd: "13:00",
      repeatWeekday: 6,
      shiftId: 8,
    },
    {
      title: "C2 früh Sonntag",
      timeStart: "08:00",
      timeEnd: "13:00",
      repeatWeekday: 0,
      shiftId: 8,
    },
    {
      title: "C1 spät Samstag",
      timeStart: "16:00",
      timeEnd: "23:00",
      repeatWeekday: 6,
      shiftId: 9,
    },
    {
      title: "C1 spät Sonntag",
      timeStart: "19:00",
      timeEnd: "23:00",
      repeatWeekday: 0,
      shiftId: 9,
    },
    {
      title: "C2 spät Samstag",
      timeStart: "16:00",
      timeEnd: "23:00",
      repeatWeekday: 6,
      shiftId: 10,
    },
    {
      title: "C2 spät Sonntag",
      timeStart: "19:00",
      timeEnd: "23:00",
      repeatWeekday: 0,
      shiftId: 10,
    },
  ]

  await models.Event.bulkCreate(events)

  await models.Schedule.create({
    title: "November ÄNoD",
    start: "2023-10-01",
    end: "2023-10-31",
    deadline: "2023-10-29",
  })

  // await models.JobEmployee.bulkCreate(
  //   employees.map((employee) => {
  //     return {
  //       jobId: 1,
  //       employeeId: employee.id,
  //     }
  //   })
  // )

  await models.ScheduleShift.bulkCreate(
    shifts.map((shift) => {
      return { scheduleId: 1, shiftId: shift.id }
    })
  )
  await models.JobShift.bulkCreate(
    shifts.map((shift) => {
      return { jobId: 1, shiftId: shift.id }
    })
  )

  // for (let i = 3; i <= 5; i++) {
  //   await models.Freetime.create({
  //     start: "2023-10-01T06:00:00.000Z",
  //     end: "2023-10-05T17:00:00.000Z",
  //     scheduleId: 1,
  //     employeeId: i,
  //   })
  // }
  // for (let i = 1; i <= 2; i++) {
  //   await models.Freetime.create({
  //     start: "2023-10-01T06:00:00.000Z",
  //     end: "2023-10-01T17:00:00.000Z",
  //     scheduleId: 1,
  //     employeeId: i,
  //   })
  // }
  // await models.ScheduleEmployee.bulkCreate(
  //   employees.map((employee) => {
  //     return { scheduleId: 1, employeeId: employee.id }
  //   })
  // )
}

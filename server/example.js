module.exports = async (models) => {
  const jobs = [
    { short: "ÄNOD", title: "ÄNoD Fahrer/-in" },
    { short: "EZ", title: "EZ Dispo" },
    { short: "MTD / HNR Fahrer/-in", title: "MTD / HNR Fahrer/-in" },
    { short: "RH", title: "Rettungshelfer" },
    { short: "RS", title: "Rettungssanitäter" },
    { short: "SH", title: "Sanitätshelfer" },
    { short: "NFS", title: "Notfallsanitäter" },
  ]

  await models.Job.bulkCreate(jobs)

  const employments = [
    {
      title: "Minijob",
      short: "MINI",
      maxHours: 40,
    },
    {
      title: "Teilzeit",
      short: "TEIL",
      minHours: 80,
    },
    {
      title: "Vollzeit",
      short: "VOLL",
      minHours: 160,
      maxHours: 180,
    },
  ]

  await models.Employment.bulkCreate(employments)

  let employees = [
    { short: "BEC", title: "Markus Becker", employmentId: 1 },
    { short: "HZF", title: "Jörn Hezfig", employmentId: 2 },
    { short: "WEW", title: "Max Wewel", employmentId: 3 },
  ]

  employees = await models.Employee.bulkCreate(employees)

  let shifts = [
    { short: "A1 früh", title: "A1 früh" },
    { short: "A2 früh", title: "A2 früh" },
    { short: "A1 spät", title: "A1 spät" },
    { short: "A2 spät", title: "A2 spät" },
    { short: "A1 Nacht", title: "A1 Nacht" },
    { short: "A2 Nacht", title: "A2 Nacht" },
    { short: "C1 früh", title: "C1 früh" },
    { short: "C2 früh", title: "C2 früh" },
    { short: "C1 spät", title: "C1 spät" },
    { short: "C2 spät", title: "C2 spät" },
  ]

  shifts = await models.Shift.bulkCreate(shifts)

  let rrules = [{ title: "A1 früh", content: "rrule a1 früh", shiftId: 1 }]

  rrules = await models.Rrule.bulkCreate(rrules)

  await models.Schedule.create({
    title: "November 2023",
    short: "NOV 23",
    start: "2023-10-01",
    end: "2023-10-31",
    deadline: "2023-10-29",
  })

  let works = [
    {
      start: new Date(2023, 12, 1, 10),
      end: new Date(2023, 12, 1, 15),
      scheduleId: 1,
      rruleId: 1,
    },
  ]
  works = await models.Work.bulkCreate(works)

  // await models.JobEmployee.bulkCreate(
  //   employees.map((employee) => {
  //     return {
  //       jobId: 1,
  //       employeeId: employee.id,
  //     }
  //   })
  // )

  await models.ScheduleEmployee.bulkCreate(
    employees.map((employee) => {
      return { scheduleId: 1, employeeId: employee.id }
    })
  )

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

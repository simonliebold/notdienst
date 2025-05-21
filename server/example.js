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

  await models.Schedule.create({
    title: "November 2023",
    short: "NOV 23",
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

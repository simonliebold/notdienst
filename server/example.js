module.exports = async (models) => {
  let jobs = [
    { short: "ÄNOD", title: "ÄNoD Fahrer/-in" },
    { short: "EZ", title: "EZ Dispo" },
    { short: "MTD / HNR", title: "MTD / HNR Fahrer/-in" },
    { short: "RH", title: "Rettungshelfer" },
    { short: "RS", title: "Rettungssanitäter" },
    { short: "SH", title: "Sanitätshelfer" },
    { short: "NFS", title: "Notfallsanitäter" },
  ]

  jobs = await models.Job.bulkCreate(jobs)

  const employments = [
    {
      title: "Minijob",
      short: "MINIJOB",
      maxHours: 40,
    },
    {
      title: "Teilzeit",
      short: "TEILZEIT",
      minHours: 80,
    },
    {
      title: "Vollzeit",
      short: "VOLLZEIT",
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
    { short: "A1", title: "A1" },
    { short: "A2", title: "A2" },
    { short: "C1", title: "C1" },
    { short: "C2", title: "C2" },
  ]

  shifts = await models.Shift.bulkCreate(shifts)

  let rrules = [
    {
      short: "A1 früh Sa, So",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,SA",
      start: "8:00",
      end: "19:00",
      shiftId: 1,
    },
    {
      short: "A2 früh Sa, So",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,SA",
      start: "8:00",
      end: "19:00",
      shiftId: 2,
    },
    {
      short: "A1 spät Mi, Fr",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=WE,FR",
      start: "13:00",
      end: "19:00",
      shiftId: 1,
    },
    {
      short: "A2 spät Mi, Fr",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=WE,FR",
      start: "13:00",
      end: "19:00",
      shiftId: 2,
    },
    {
      short: "A1 Nacht Mo, Di, Do",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,TH,",
      start: "18:00",
      end: "8:00",
      shiftId: 1,
    },
    {
      short: "A2 Nacht Mo, Di, Do",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,TH",
      start: "18:00",
      end: "8:00",
      shiftId: 2,
    },
    {
      short: "A1 Nacht Mi, Fr, Sa, So",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=WE,FR,SA,SU",
      start: "18:00",
      end: "8:00",
      shiftId: 1,
    },
    {
      short: "A2 Nacht Mi, Fr, Sa, So",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=WE,FR,SA,SU",
      start: "19:00",
      end: "8:00",
      shiftId: 2,
    },
    {
      short: "C1 früh",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,SA",
      start: "8:00",
      end: "16:00",
      shiftId: 3,
    },
    {
      short: "C2 früh",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,SA",
      start: "8:00",
      end: "13:00",
      shiftId: 4,
    },
    {
      short: "C1 spät",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,SA",
      start: "16:00",
      end: "23:00",
      shiftId: 3,
    },
    {
      short: "C2 spät",
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,SA",
      start: "19:00",
      end: "23:00",
      shiftId: 4,
    },
  ]

  rrules = await models.Rrule.bulkCreate(rrules)

  await models.Schedule.create({
    title: "Januar 2024",
    short: "JAN 24",
    start: "2024-01-01",
    end: "2024-01-31",
    deadline: "2023-12-10 9:00",
  })

  let works = [
    {
      start: new Date(2023, 12, 1, 10),
      end: new Date(2023, 12, 1, 15),
      scheduleId: 1,
      rruleId: 1,
    },
    {
      start: new Date(2023, 12, 1, 10),
      end: new Date(2023, 12, 1, 15),
      scheduleId: 1,
      rruleId: 1,
    },
    {
      start: new Date(2023, 12, 1, 10),
      end: new Date(2023, 12, 1, 15),
      scheduleId: 1,
      rruleId: 1,
    },
    {
      start: new Date(2023, 12, 1, 10),
      end: new Date(2023, 12, 1, 15),
      scheduleId: 1,
      rruleId: 1,
    },
  ]
  works = await models.Work.bulkCreate(works)

  await models.WorkEmployee.bulkCreate(
    works.map((work) => {
      return { workId: work.id, employeeId: 1 }
    })
  )

  await models.JobEmployee.bulkCreate(
    jobs.map((job) => {
      return {
        jobId: job.id,
        employeeId: 1,
      }
    })
  )

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

  await models.Freetime.bulkCreate([
    { type: "Wunschfrei", date: new Date(), scheduleId: 1, employeeId: 1 },
    { type: "Nicht Tag", date: new Date(), scheduleId: 1, employeeId: 1 },
    { type: "Nicht Nacht", date: new Date(), scheduleId: 1, employeeId: 1 },
    {
      type: "Seminar / Ausbildung",
      date: new Date(),
      scheduleId: 1,
      employeeId: 1,
    },
    { type: "Urlaub", date: new Date(), scheduleId: 1, employeeId: 1 },
  ])

  await models.Mission.bulkCreate([
    {
      type: "Arzt aufgenommen",
      km: 255090,
      time: new Date("2024-01-17 20:00:00"),
      workId: 1,
      employeeId: 1,
    },
    {
      type: "Arzt abgeliefert",
      info: "Übergabe an der Wache an nächsten Fahrer",
      km: 255168,
      time: new Date("2024-01-18 08:00:00"),
      workId: 1,
      employeeId: 1,
    },
  ])
}

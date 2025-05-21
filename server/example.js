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
      minHours: 20,
      maxHours: 40,
    },
    {
      title: "Teilzeit",
      short: "TEILZEIT",
      minHours: 80,
      maxHours: 160,
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
    { short: "KRÄ", title: "Emilia Krämer", employmentId: 3 },
    { short: "KLU", title: "Antje Kluge", employmentId: 3 },
    { short: "SCH", title: "Noah Schuster", employmentId: 3 },
    { short: "KAI", title: "Lina Kaiser", employmentId: 3 },
    { short: "ZIM", title: "Adam Zimmermann", employmentId: 3 },
    { short: "SMT", title: "Carla Schmidt", employmentId: 3 },
    { short: "KÄS", title: "Wolfgang Kästner", employmentId: 3 },
    { short: "EGG", title: "Markus Egger", employmentId: 3 },
    // { short: "BÄR", title: "Sebastian Bär", employmentId: 3 },
    // { short: "WOL", title: "Jennifer Wolf", employmentId: 3 },
    // { short: "SER", title: "Caroline Scherer", employmentId: 3 },
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
      content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,TH",
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

  // let works = [
  //   {
  //     start: new Date(2023, 12, 1, 10),
  //     end: new Date(2023, 12, 1, 15),
  //     scheduleId: 1,
  //     rruleId: 1,
  //   },
  //   {
  //     start: new Date(2023, 12, 1, 10),
  //     end: new Date(2023, 12, 1, 15),
  //     scheduleId: 1,
  //     rruleId: 1,
  //   },
  //   {
  //     start: new Date(2023, 12, 1, 10),
  //     end: new Date(2023, 12, 1, 15),
  //     scheduleId: 1,
  //     rruleId: 1,
  //   },
  //   {
  //     start: new Date(2023, 12, 1, 10),
  //     end: new Date(2023, 12, 1, 15),
  //     scheduleId: 1,
  //     rruleId: 1,
  //   },
  // ]
  // works = await models.Work.bulkCreate(works)

  // await models.WorkEmployee.bulkCreate(
  //   works.map((work) => {
  //     return { workId: work.id, employeeId: 1 }
  //   })
  // )

  await models.JobEmployee.bulkCreate(
    employees.map((employee) => {
      return {
        jobId: 1,
        employeeId: employee.id,
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
    {
      type: "Wunschfrei",
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 1, 23, 59, 59),
      employeeId: 1,
    },
    {
      type: "Nicht Tag",
      start: new Date(2024, 0, 2),
      end: new Date(2024, 0, 2, 23, 59, 59),
      employeeId: 2,
    },
    {
      type: "Nicht Nacht",
      start: new Date(2024, 0, 3),
      end: new Date(2024, 0, 3, 23, 59, 59),
      employeeId: 3,
    },
    // {
    //   type: "Seminar",
    //   start: new Date(),
    //   end: new Date(),
    //   employeeId: 1,
    // },
    // {
    //   type: "Urlaub",
    //   start: new Date(),
    //   end: new Date(),
    //   employeeId: 1,
    // },
  ])

  // await models.Mission.bulkCreate([
  //   {
  //     type: "Arzt aufgenommen",
  //     km: 255090,
  //     time: new Date("2024-01-17 20:00:00"),
  //     workId: 1,
  //     employeeId: 1,
  //   },
  //   {
  //     type: "Arzt abgeliefert",
  //     info: "Übergabe an der Wache an nächsten Fahrer",
  //     km: 255168,
  //     time: new Date("2024-01-18 08:00:00"),
  //     workId: 1,
  //     employeeId: 1,
  //   },
  // ])
}

module.exports = async (models) => {
  await models.Job.create({ title: "ÄNoD Fahrer/-in" })
  await models.Job.create({ title: "EZ Dispo" })
  await models.Job.create({ title: "MTD / HNR Fahrer/-in" })
  await models.Job.create({ title: "RH" })
  await models.Job.create({ title: "RS" })
  await models.Job.create({ title: "SH" })
  await models.Job.create({ title: "NFS" })

  await models.Employment.create({ title: "Minijob", minHours: 10, maxHours: 40 })
  await models.Employment.create({ title: "Teilzeit", minHours: 80, maxHours: 200 })
  await models.Employment.create({ title: "Vollzeit", minHours: 160, maxHours: 200 })
  
  await models.Employee.create({
    initials: "RER",
    name: "Tom Rerucha",
    employmentId: 3,
  })
  await models.Employee.create({
    initials: "LIEB",
    name: "Simon Liebold",
    employmentId: 1,
  })
  await models.Employee.create({
    initials: "PAP",
    name: "Niklas Pape",
    employmentId: 2,
  })
  
  await models.JobEmployee.create({
    jobId: 1,
    employeeId: 3
  })
  await models.JobEmployee.create({
    jobId: 1,
    employeeId: 2
  })

  await models.Shift.create({ title: "A1" })
  await models.Shift.create({ title: "A2" })
  await models.Shift.create({ title: "C1" })
  await models.Shift.create({ title: "C2" })

  await models.Event.create({
    title: "A1 spät Mittwoch",
    dateStart: "2023-11-1",
    timeStart: "13:00",
    duration: 6,
    repeatWeekday: 2,
    shiftId: 1,
  })
  await models.Event.create({
    title: "A1 spät Freitag",
    dateStart: "2023-11-1",
    timeStart: "13:00",
    duration: 6,
    repeatWeekday: 4,
    shiftId: 1,
  })
  await models.Event.create({
    title: "A1 früh Samstag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 5,
    shiftId: 1,
  })
  await models.Event.create({
    title: "A1 früh Sonntag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 6,
    shiftId: 1,
  })
  await models.Event.create({
    title: "A1 früh Feiertag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 7,
    shiftId: 1,
  })
  await models.Event.create({
    title: "A2 spät Mittwoch",
    dateStart: "2023-11-1",
    timeStart: "13:00",
    duration: 6,
    repeatWeekday: 2,
    shiftId: 2,
  })
  await models.Event.create({
    title: "A2 spät Freitag",
    dateStart: "2023-11-1",
    timeStart: "13:00",
    duration: 6,
    repeatWeekday: 4,
    shiftId: 2,
  })
  await models.Event.create({
    title: "A2 früh Samstag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 5,
    shiftId: 2,
  })
  await models.Event.create({
    title: "A2 früh Sonntag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 6,
    shiftId: 2,
  })
  await models.Event.create({
    title: "A2 früh Feiertag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 7,
    shiftId: 2,
  })

  await models.Schedule.create({
    title: "November ÄNoD",
    start: "2023-11-01",
    end: "2023-11-30",
    deadline: "2023-10-29",
  })
}

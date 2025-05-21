module.exports = (models) => {
  models.Job.create({ title: "ÄNoD Fahrer/-in" })
  models.Job.create({ title: "EZ Dispo" })
  models.Job.create({ title: "MTD / HNR Fahrer/-in" })
  models.Job.create({ title: "RH" })
  models.Job.create({ title: "RS" })
  models.Job.create({ title: "SH" })
  models.Job.create({ title: "NFS" })

  models.Employment.create({ title: "Minijob", minHours: 10, maxHours: 40 })
  models.Employment.create({ title: "Teilzeit", minHours: 80, maxHours: 200 })
  models.Employment.create({ title: "Vollzeit", minHours: 160, maxHours: 200 })

  models.Employee.create({
    initials: "RER",
    name: "Tom Rerucha",
    employmentId: 2,
  })
  models.Employee.create({
    initials: "LIEB",
    name: "Simon Liebold",
    employmentId: 1,
  })
  models.Employee.create({
    initials: "PAP",
    name: "Niklas Pape",
    employmentId: 3,
  })

  models.Shift.create({ title: "A1" })
  models.Shift.create({ title: "A2" })
  models.Shift.create({ title: "C1" })
  models.Shift.create({ title: "C2" })

  models.Event.create({
    title: "A1 spät Mittwoch",
    dateStart: "2023-11-1",
    timeStart: "13:00",
    duration: 6,
    repeatWeekday: 2,
    shiftId: 1,
  })
  models.Event.create({
    title: "A1 spät Freitag",
    dateStart: "2023-11-1",
    timeStart: "13:00",
    duration: 6,
    repeatWeekday: 4,
    shiftId: 1,
  })
  models.Event.create({
    title: "A1 früh Samstag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 5,
    shiftId: 1,
  })
  models.Event.create({
    title: "A1 früh Sonntag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 6,
    shiftId: 1,
  })
  models.Event.create({
    title: "A1 früh Feiertag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 7,
    shiftId: 1,
  })

  models.Event.create({
    title: "A2 spät Mittwoch",
    dateStart: "2023-11-1",
    timeStart: "13:00",
    duration: 6,
    repeatWeekday: 2,
    shiftId: 1,
  })
  models.Event.create({
    title: "A2 spät Freitag",
    dateStart: "2023-11-1",
    timeStart: "13:00",
    duration: 6,
    repeatWeekday: 4,
    shiftId: 1,
  })
  models.Event.create({
    title: "A2 früh Samstag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 5,
    shiftId: 1,
  })
  models.Event.create({
    title: "A2 früh Sonntag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 6,
    shiftId: 1,
  })
  models.Event.create({
    title: "A2 früh Feiertag",
    dateStart: "2023-11-1",
    timeStart: "8:00",
    duration: 11,
    repeatWeekday: 7,
    shiftId: 1,
  })
}

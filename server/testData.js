const Employee = require("./schemas/Employee")
const Employment = require("./schemas/Employment")
const Job = require("./schemas/Job")
const Schedule = require("./schemas/Schedule")
const Shift = require("./schemas/Shift")
const Work = require("./schemas/Work")

const loadTestData = async () => {
  await Employee.deleteMany({})
  await Employment.deleteMany({})
  await Job.deleteMany({})
  await Shift.deleteMany({})
  await Work.deleteMany({})
  await Schedule.deleteMany({})

  const minijob = new Employment({
    short: "MINI",
    title: "Minijob",
    maxHours: 44,
    minHours: 20,
  })
  minijob.save()

  new Employment({
    short: "TEIL",
    title: "Teilzeit",
    maxHours: 180,
    minHours: 160,
  }).save()

  const anod = new Job({ short: "ÄNoD", title: "Ärztlicher Notdienst" })
  anod.save()
  new Job({ short: "EZ", title: "Einsatzzentrale Dispo" }).save()

  const lbd = new Employee({
    short: "lbd",
    title: "Simon Liebold",
    employmentId: minijob._id,
    jobIds: [anod._id],
    freetimes: [{ start: new Date(), end: new Date() }],
  })
  lbd.save()

  const a1Nacht = new Shift({
    short: "A1 Nacht",
    title: "A1 Nacht",
    jobIds: [anod._id],
    rrules: [
      {
        start: "19:00:00",
        end: "08:00:00",
        content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,SA",
      },
    ],
  })
  a1Nacht.save()

  const jan24 = new Schedule({
    short: "Jan 24",
    title: "Januar 2024"
  })
  jan24.save()

  const work = new Work({
    short: "WORK 1",
    title: "Test-Dienst",
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    shiftId: a1Nacht._id,
    scheduleId: jan24._id,
    employeeIds: [lbd._id],
  })

  work.save()
}

module.exports = loadTestData

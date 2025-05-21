const Employee = require("./models/Employee")
const Employment = require("./models/Employment")
const Exchange = require("./models/Exchange")
const Freetime = require("./models/Freetime")
const Job = require("./models/Job")
const Rrule = require("./models/Rrule")
const Schedule = require("./models/Schedule")
const Shift = require("./models/Shift")
const Work = require("./models/Work")

const loadTestData = async () => {
  await Employee.deleteMany({})
  await Employment.deleteMany({})
  await Job.deleteMany({})
  await Shift.deleteMany({})
  await Work.deleteMany({})
  await Schedule.deleteMany({})
  await Freetime.deleteMany({})
  await Rrule.deleteMany({})
  await Exchange.deleteMany({})

  const minijob = new Employment({
    short: "MINI",
    title: "Minijob",
    maxHours: 44,
    minHours: 20,
  })
  minijob.save()

  const teilzeit = new Employment({
    short: "TEIL",
    title: "Teilzeit",
    maxHours: 180,
    minHours: 160,
  })
  teilzeit.save()

  const anod = new Job({ short: "ÄNoD", title: "Ärztlicher Notdienst" })
  anod.save()
  new Job({ short: "EZ", title: "Einsatzzentrale Dispo" }).save()

  const lbd = new Employee({
    _id: "65c74826b3bd0e5e4d467b3f",
    short: "lbd",
    title: "Simon Liebold",
    employmentId: minijob._id,
    jobIds: [anod._id],
  })
  lbd.save()

  const pap = new Employee({
    short: "pap",
    title: "Niklas Pape",
    employmentId: teilzeit._id,
    jobIds: [anod._id],
  })
  pap.save()

  const freetime = new Freetime({
    short: "Free 1",
    title: "Urlaub heute",
    start: new Date(),
    end: new Date(),
    employeeId: lbd._id,
  })
  freetime.save()

  const a1Nacht = new Shift({
    short: "A1 Nacht",
    title: "A1 Nacht",
    jobIds: [anod._id],
  })
  a1Nacht.save()

  const rrule = new Rrule({
    short: "A1 Nacht",
    title: "A1 Nacht ab 19 Uhr",
    start: "19:00:00",
    end: "08:00:00",
    content: "FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,SA",
    shiftId: a1Nacht._id,
  })
  rrule.save()

  const jan24 = new Schedule({
    short: "Jan 24",
    title: "Januar 2024",
  })
  jan24.save()

  const workA = new Work({
    short: "work A",
    title: "Test-Dienst A",
    start: new Date(2024, 2, 19, 19).toISOString(),
    end: new Date(2024, 2, 20, 8).toISOString(),
    shiftId: a1Nacht._id,
    scheduleId: jan24._id,
    employeeIds: [pap._id],
  })
  workA.save()

  const workB = new Work({
    short: "work B",
    title: "Test-Dienst B",
    start: new Date(2024, 2, 4, 18).toISOString(),
    end: new Date(2024, 2, 5, 8).toISOString(),
    shiftId: a1Nacht._id,
    scheduleId: jan24._id,
    employeeIds: [lbd._id],
  })
  workB.save()

  const exchange = new Exchange({
    short: "A-b",
    title: "Tausch LBD und PAP",
    status: "Angebot",
    outgoingId: workB._id,
    incomingId: workA._id,
    senderIds: [lbd._id],
    receiverIds: [pap._id],
  })

  exchange.save()
}

module.exports = loadTestData

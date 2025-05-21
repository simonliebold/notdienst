const Employee = require("./schemas/Employee")
const Employment = require("./schemas/Employment")
const Job = require("./schemas/Job")

const loadTestData = async () => {
  await Employee.deleteMany({})
  await Employment.deleteMany({})
  await Job.deleteMany({})

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

  new Employee({
    short: "lbd",
    title: "Simon Liebold",
    employment: minijob._id,
    jobs: [anod._id],
  }).save()
}

module.exports = loadTestData

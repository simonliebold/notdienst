const mongoose = require("mongoose")
const Job = require("../schemas/Job")

const router = require("express").Router()
const roles = require("./../roles")

// Get all
router.get("/", roles.requireAdmin, async (req, res, next) => {
  try {
    const jobs = await Job.find({})
    if (!jobs) return next(new Error("Nicht gefunden"))
    return res.send(jobs)
  } catch (err) {
    return next(err)
  }
})

// Get one
router.get("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    const job = await Job.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "jobIds",
          as: "employees",
        },
      },
    ])
    if (!job) return next(new Error("Nicht gefunden"))
    return res.send(job[0])
  } catch (err) {
    return next(err)
  }
})

// Create one
router.post("/", roles.requireAdmin, async (req, res, next) => {
  try {
    const { short, title, employees } = req?.body || {}
    const job = new Job({
      short,
      title,
      employees,
    })

    await job.save()

    return res.send(job)
  } catch (err) {
    return next(err)
  }
})

// Update one
router.put("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    const { short, title, employees } = req?.body || {}
    await Job.findByIdAndUpdate(req.params.id, {
      short,
      title,
      employees,
    })

    return res.send({ message: "Erfolgreich aktualisiert" })
  } catch (err) {
    return next(err)
  }
})

// Delete one
router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    await Job.findByIdAndDelete(req.params.id)
    return res.send({ message: "Endgültig gelöscht" })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

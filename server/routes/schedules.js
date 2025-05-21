module.exports = () => {
  const mongoose = require("mongoose")
  const Schedule = require("../schemas/Schedule")
  const router = require("express").Router()
  const roles = require("../roles")

  const getSchedule = async (req, res, next) => {
    try {
      const schedule = await Schedule.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "works",
            localField: "_id",
            foreignField: "scheduleId",
            as: "works",
          },
        },
      ])
      if (!schedule) return next(new Error("Nicht gefunden"))
      req.schedule = schedule[0]
      next()
    } catch (err) {
      return next(err)
    }
  }

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const schedules = await Schedule.find({})
      if (!schedules) return next(new Error("Nicht gefunden"))
      return res.send(schedules)
    } catch (err) {
      return next(err)
    }
  })

  // Get one
  router.get(
    "/:id",
    roles.requireAdmin,
    getSchedule,
    async (req, res, next) => {
      return res.send(req.schedule)
    }
  )

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title } = req?.body || {}
      const schedule = new Schedule({
        short,
        title,
      })

      await schedule.save()

      return res.send(schedule)
    } catch (err) {
      return next(err)
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title } = req?.body || {}
      await Schedule.findByIdAndUpdate(req.params.id, {
        short,
        title,
      })

      return res.send({ message: "Erfolgreich aktualisiert" })
    } catch (err) {
      return next(err)
    }
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      await Schedule.findByIdAndDelete(req.params.id)
      return res.send({ message: "Endgültig gelöscht" })
    } catch (err) {
      return next(err)
    }
  })

  return router
}

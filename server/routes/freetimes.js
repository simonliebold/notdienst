const { default: mongoose } = require("mongoose")
const Freetime = require("../schemas/Freetime")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const freetimes = await Freetime.find({})
      if (!freetimes) return next(new Error("Nicht gefunden"))
      return res.send(freetimes)
    } catch (err) {
      return next(err)
    }
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const freetime = await Freetime.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "employees",
            localField: "employeeId",
            foreignField: "_id",
            as: "employee",
          },
        },
        { $unwind: "$employee" },
      ])
      if (!freetime) return next(new Error("Nicht gefunden"))
      return res.send(freetime[0])
    } catch (err) {
      return next(err)
    }
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, start, end, employeeId } = req?.body || {}
      const freetime = new Freetime({
        short,
        title,
        start,
        end,
        employeeId,
      })
      await freetime.save()
    } catch (err) {
      return next(err)
    }
    return res.send(freetime)
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, start, end } = req?.body || {}
      await Freetime.findByIdAndUpdate(req.params.id, {
        short,
        title,
        start,
        end,
      })

      return res.send({ message: "Erfolgreich aktualisiert" })
    } catch (err) {
      return next(err)
    }
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      await Freetime.findByIdAndDelete(req.params.id)
      return res.send({ message: "Endgültig gelöscht" })
    } catch (err) {
      return next(err)
    }
  })

  return router
}

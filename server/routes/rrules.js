const { default: mongoose } = require("mongoose")
const Rrule = require("../schemas/Rrule")

const router = require("express").Router()
const roles = require("../roles")

// Get all
router.get("/", roles.requireAdmin, async (req, res, next) => {
  try {
    const rrules = await Rrule.find({})
    if (!rrules) return next(new Error("Nicht gefunden"))
    return res.send(rrules)
  } catch (err) {
    return next(err)
  }
})

// Get one
router.get("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    const rrule = await Rrule.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "shifts",
          localField: "shiftId",
          foreignField: "_id",
          as: "shift",
        },
      },
      { $unwind: "$shift" },
    ])
    if (!rrule) return next(new Error("Nicht gefunden"))
    return res.send(rrule[0])
  } catch (err) {
    return next(err)
  }
})

// Create one
router.post("/", roles.requireAdmin, async (req, res, next) => {
  try {
    const { short, title, start, end, content, shiftId } = req?.body || {}
    const rrule = new Rrule({
      short,
      title,
      start,
      end,
      content,
      shiftId,
    })
    await rrule.save()
    return res.send(rrule)
  } catch (err) {
    return next(err)
  }
})

// Update one
router.put("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    const { short, title, start, end, content } = req?.body || {}
    await Rrule.findByIdAndUpdate(req.params.id, {
      short,
      title,
      start,
      end,
      content,
    })

    return res.send({ message: "Erfolgreich aktualisiert" })
  } catch (err) {
    return next(err)
  }
})

// Delete one
router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    await Rrule.findByIdAndDelete(req.params.id)
    return res.send({ message: "Endgültig gelöscht" })
  } catch (err) {
    return next(err)
  }
})
module.exports = router

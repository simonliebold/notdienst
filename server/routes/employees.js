const { default: mongoose } = require("mongoose")
const Employee = require("../schemas/Employee")
const router = require("express").Router()
const roles = require("./../roles")

// Get all
router.get("/", roles.requireAdmin, async (req, res, next) => {
  try {
    const employees = await Employee.find({})
    if (!employees) return next(new Error("Nicht gefunden"))
    return res.send(employees)
  } catch (err) {
    return next(err)
  }
})

// Get one
router.get("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    const employee = await Employee.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobIds",
          foreignField: "_id",
          as: "jobs",
        },
      },
      {
        $lookup: {
          from: "employments",
          localField: "employmentId",
          foreignField: "_id",
          as: "employment",
        },
      },
      { $unwind: { path: "$employment", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "freetimes",
          localField: "_id",
          foreignField: "employeeId",
          as: "freetimes",
        },
      },
    ])
    if (!employee) return next(new Error("Nicht gefunden"))
    return res.send(employee[0])
  } catch (err) {
    return next(err)
  }
})

// Create one
router.post("/", roles.requireAdmin, async (req, res, next) => {
  try {
    const { short, title, employmentId, jobIds } = req?.body || {}
    const employee = new Employee({
      short,
      title,
      employmentId,
      jobIds,
    })

    await employee.save()

    return res.send(employee)
  } catch (err) {
    return next(err)
  }
})

// Update one
router.put("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    const { short, title, employmentId, jobIds } = req?.body || {}
    await Employee.findByIdAndUpdate(req.params.id, {
      short,
      title,
      employmentId,
      jobIds,
    })

    return res.send({ message: "Erfolgreich aktualisiert" })
  } catch (err) {
    return next(err)
  }
})

// Delete one
router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    await Employee.findByIdAndDelete(req.params.id)
    return res.send({ message: "Endgültig gelöscht" })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

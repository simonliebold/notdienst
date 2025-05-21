const { default: mongoose } = require("mongoose")
const Employee = require("../schemas/Employee")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    const employees = await Employee.find({}).catch(next)
    if (!employees) return next(new Error("Nicht gefunden"))
    return res.send(employees)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
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
    ]).catch(next)
    console.log("employee")
    if (!employee) return next(new Error("Nicht gefunden"))
    return res.send(employee[0])
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employment, jobs } = req?.body || {}
    const employee = new Employee({
      short,
      title,
      employment,
      jobs,
    })

    await employee.save().catch(next)

    return res.send(employee)
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employment, jobs } = req?.body || {}
    await Employee.findByIdAndUpdate(req.params.id, {
      short,
      title,
      employment,
      jobs,
    }).catch(next)

    return res.send({ message: "Erfolgreich aktualisiert" })
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    await Employee.findByIdAndDelete(req.params.id).catch(next)
    return res.send({ message: "Endgültig gelöscht" })
  })

  return router
}

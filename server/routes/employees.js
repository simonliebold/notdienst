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
    const employee = await Employee.findById(req.params.id)
      .populate("employment")
      .populate("jobs")
      .catch(next)
    if (!employee) return next(new Error("Nicht gefunden"))
    return res.send(employee)
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res) => {})

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res) => {})

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res) => {})

  return router
}

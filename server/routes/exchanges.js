const { default: mongoose } = require("mongoose")
const Exchange = require("../schemas/Exchange")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const exchanges = await Exchange.find({})
      if (!exchanges) return next(new Error("Nicht gefunden"))
      return res.send(exchanges)
    } catch (err) {
      return next(err)
    }
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const exchange = await Exchange.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "employees",
            localField: "senderIds",
            foreignField: "_id",
            as: "sender",
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "receiverIds",
            foreignField: "_id",
            as: "receiver",
          },
        },
        {
          $lookup: {
            from: "works",
            localField: "outgoingId",
            foreignField: "_id",
            as: "outgoing",
          },
        },
        {
          $lookup: {
            from: "works",
            localField: "incomingId",
            foreignField: "_id",
            as: "incoming",
          },
        },
        { $unwind: "$outgoing" },
        { $unwind: "$incoming" },
      ])
      if (!exchange) return next(new Error("Nicht gefunden"))
      return res.send(exchange[0])
    } catch (err) {
      return next(err)
    }
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, senderIds, receiverIds, outgoingId, incomingId } =
        req?.body || {}
      const exchange = new Exchange({
        short,
        title,
        senderIds,
        receiverIds,
        outgoingId,
        incomingId,
      })
      await exchange.save()
      return res.send(exchange)
    } catch (err) {
      return next(err)
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, senderIds, receiverIds, outgoingId, incomingId } =
        req?.body || {}
      await Exchange.findByIdAndUpdate(req.params.id, {
        short,
        title,
        senderIds,
        receiverIds,
        outgoingId,
        incomingId,
      })

      return res.send({ message: "Erfolgreich aktualisiert" })
    } catch (err) {
      return next(err)
    }
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      await Exchange.findByIdAndDelete(req.params.id)
      return res.send({ message: "Endgültig gelöscht" })
    } catch (err) {
      return next(err)
    }
  })

  return router
}

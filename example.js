module.exports = (models) => {
  models.Job.create({ title: "ÄNoD Fahrer/-in" })
  models.Job.create({ title: "EZ Dispo" })
  models.Job.create({ title: "MTD / HNR Fahrer/-in" })
  models.Job.create({ title: "RH" })
  models.Job.create({ title: "RS" })
  models.Job.create({ title: "SH" })
  models.Job.create({ title: "NFS" })

  models.Employment.create({ title: "Minijob", minHours: 10, maxHours: 40 })
  models.Employment.create({ title: "Teilzeit", minHours: 80, maxHours: 200 })
  models.Employment.create({ title: "Vollzeit", minHours: 160, maxHours: 200 })

  models.Employee.create({ initials: "RER", name: "Tom Rerucha" })
  models.Employee.create({ initials: "LIEB", name: "Simon Liebold" })
  models.Employee.create({ initials: "PAP", name: "Niklas Pape" })
}

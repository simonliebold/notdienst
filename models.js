// TODO: fix timestamp timezone
module.exports = (sequelize) => {
  const Employee = require("./models/Employee")(sequelize)
  const Job = require("./models/Job")(sequelize)
  const Employment = require("./models/Employment")(sequelize)
  const Shift = require("./models/Shift")(sequelize)
  const Event = require("./models/Event")(sequelize)
  const Work = require("./models/Work")(sequelize)
  const Schedule = require("./models/Schedule")(sequelize)
  const Freetime = require("./models/Freetime")(sequelize)

  Employee.belongsTo(Employment)

  Work.belongsTo(Schedule)
  Work.belongsTo(Event)

  Freetime.belongsTo(Schedule)
  Freetime.belongsTo(Employee)

  Event.belongsTo(Shift)

  const JobEmployee = require("./models/JobEmployee")(sequelize)
  Job.belongsToMany(Employee, { through: "jobs_employees" })
  Employee.belongsToMany(Job, { through: "jobs_employees" })
  
  const JobShift = require("./models/JobShift")(sequelize)
  Job.belongsToMany(Shift, { through: "jobs_shifts" })
  Shift.belongsToMany(Job, { through: "jobs_shifts" })
  
  const ScheduleShift = require("./models/ScheduleShift")(sequelize)
  Schedule.belongsToMany(Shift, { through: "schedules_shifts" })
  Shift.belongsToMany(Schedule, { through: "schedules_shifts" })
  
  const ScheduleEmployee = require("./models/ScheduleEmployee")(sequelize)
  Schedule.belongsToMany(Employee, { through: "schedules_employees" })
  Employee.belongsToMany(Schedule, { through: "schedules_employees" })

  return {
    Employee,
    Job,
    Employment,
    Shift,
    Event,
    Work,
    Schedule,
    Freetime,
    JobEmployee,
    JobShift,
    ScheduleShift,
    ScheduleEmployee
  }
}

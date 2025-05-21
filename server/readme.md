<!-- TODO: add return values -->
## Employments
### Get all employments
<pre>GET /employments</pre>

### Get one employment
<pre>GET /employments/:id</pre>

### Create one employment
<pre>
POST /employments

content-type: application/json
{
    title: String
    minHours: int
    maxHours: int
}
</pre>


### Update one employment

<pre>
PUT /employments/:id

content-type: application/json
{
    title?: String
    minHours?: int
    maxHours?: int
}
</pre>

### Delete one employment
<pre>DELETE /employments/:id</pre>

## Employees
### Get all employees
<pre>GET /employees</pre>

### Get one employee
<pre>GET /employees/:id</pre>

### Create one employee
<pre>
POST /employees

content-type: application/json
{
    initials: String,
    name: String,
    employmentId: int
}
</pre>

### Update one employee
<pre>
PUT /employees/:id

content-type: application/json
{
    initials?: String,
    name?: String,
    employmentId?: int
}
</pre>

### Delete one employee
<pre>DELETE /employees/:id</pre>

## Jobs
### Get all jobs
<pre>GET /jobs</pre>

### Get one job
<pre>GET /jobs/:id</pre>

### Create one job
<pre>
POST /jobs

content-type: application/json
{
    title: String
}
</pre>

### Update one job
<pre>
PUT /jobs/:id

content-type: application/json
{
    title?: String
}
</pre>

### Delete one job
<pre>DELETE /jobs/:id</pre>

### Get all employees from job
<pre>GET /jobs/:id/employee</pre>

### Add employees to job
<pre>
POST /jobs/:id/employee

content-type: application/json
{
    employeeIds: [int]
}
</pre>

### Delete employee from job
<pre>
DELETE /jobs/:id/employee

content-type: application/json
{
    employeeIds: [int]
}
</pre>

### Get all shifts from job
<pre>GET /jobs/:id/employee</pre>

### Add shifts to job
<pre>
POST /jobs/:id/employee

content-type: application/json
{
    shiftIds: [int]
}
</pre>

### Delete shifts from job
<pre>
DELETE /jobs/:id/employee

content-type: application/json
{
    shiftIds: [int]
}
</pre>

## Shifts
### Get all shifts
<pre>GET /shifts</pre>

### Get one shift
<pre>GET /shifts/:id</pre>

### Create one shift
<pre>
POST /shifts

content-type: application/json
{
    title: String
}
</pre>

### Update one shift
<pre>
PUT /shifts/:id

content-type: application/json
{
    title?: String
}
</pre>

### Delete one shift
<pre>DELETE /shifts/:id</pre>

## Works
### Get all works
<pre>GET /works</pre>

### Get one work
<pre>GET /works/:id</pre>

### Create one work
<pre>
POST /works

content-type: application/json
{
    start: Date Time String,
    end: Date Time String,
    scheduleId: int,
    eventId: int
}
</pre>

### Update one work
<pre>
PUT /works/:id

content-type: application/json
{
    start?: Date Time String,
    end?: Date Time String,
    scheduleId?: int,
    eventId?: int
}
</pre>

### Delete one work
<pre>DELETE /works/:id</pre>

## Events
### Get all events
<pre>GET /events</pre>

### Get one event
<pre>GET /events/:id</pre>

### Create one event
<pre>
POST /events

content-type: application/json
{
    title: String,
    dateStart: Date,
    timeStart: Time,
    duration: int,
    repeatWeekday: int,
    shiftId: int
}
</pre>

### Update one event
<pre>
PUT /events/:id

content-type: application/json
{
    title?: String,
    dateStart?: Date,
    timeStart?: Time,
    duration?: int,
    repeatWeekday?: int,
    shiftId?: int
}
</pre>

### Delete one event
<pre>DELETE /events/:id</pre>

## Freetimes
### Get all freetimes
<pre>GET /freetimes</pre>

### Get one freetime
<pre>GET /freetimes/:id</pre>

### Create one freetime
<pre>
POST /freetimes

content-type: application/json
{
    start: Date Time String,
    end: Date Time String,
    scheduleId: int,
    employeeId: int
}
</pre>

### Update one freetime
<pre>
PUT /freetimes/:id

content-type: application/json
{
    start?: Date Time String,
    end?: Date Time String,
    scheduleId?: int,
    employeeId?: int
}
</pre>

### Delete one freetime
<pre>DELETE /freetimes/:id</pre>

## Schedules
### Get all schedules
<pre>GET /schedules</pre>

### Get one schedule
<pre>GET /schedules/:id</pre>

### Create one schedule
<pre>
POST /schedules

content-type: application/json
{
    title: String,
    start: Date,
    end: Date,
    deadline: Date Time String
}
</pre>

### Update one schedule
<pre>
PUT /schedules/:id

content-type: application/json
{
    title?: String,
    start?: Date,
    end?: Date,
    deadline?: Date Time String
}
</pre>

### Delete one schedule
<pre>DELETE /schedules/:id</pre>

### Get all employees from schedule
<pre>GET /schedules/:id/employee</pre>

### Add employees to schedule
<pre>
POST /schedules/:id/employee

content-type: application/json
{
    employeeIds: [int]
}
</pre>

### Delete employee from schedule
<pre>
DELETE /schedules/:id/employee

content-type: application/json
{
    employeeIds: [int]
}
</pre>

### Get all shifts from schedule
<pre>GET /schedules/:id/employee</pre>

### Add shifts to schedule
<pre>
POST /schedules/:id/employee

content-type: application/json
{
    shiftIds: [int]
}
</pre>

### Delete shifts from schedule
<pre>
DELETE /schedules/:id/employee

content-type: application/json
{
    shiftIds: [int]
}
</pre>

# Formats
[Date Time String](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format)
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

## Works

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
    initials: String,
    name: String,
    employmentId: int
}
</pre>

### Update one event
<pre>
PUT /events/:id

content-type: application/json
{
    initials?: String,
    name?: String,
    employmentId?: int
}
</pre>

### Delete one event
<pre>DELETE /events/:id</pre>

## Freetimes

## Schedules
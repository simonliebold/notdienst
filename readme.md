## Employments
### Get all employments
<code>GET /employments</code>

### Get one employment
<code>GET /employments/:id</code>

### Create one employment
<code>POST /employments</code>
#### Body
<pre>
{
    title: String
    minHours: int
    maxHours: int
}
</pre>


### Update one employment
<code>PUT /employments/:id</code>

#### Body
<pre>
{
    title?: String
    minHours?: int
    maxHours?: int
}
</pre>

### Delete one employment
<code>DELETE /employments/:id</code>

## Employees
### Get all employees
<code>GET /employees</code>

### Get one employee
<code>GET /employees/:id</code>

### Create one employee
<code>POST /employees</code>

#### Body
<pre>
{
    initials: String
    name: String
}
</pre>

### Update one employee
<code>PUT /employees/:id</code>

#### Body
<pre>
{
    initials?: String
    name?: String
}
</pre>

### Delete one employee
<code>DELETE /employees/:id</code>

## Jobs
### Get all jobs
<code>GET /jobs</code>

### Get one job
<code>GET /jobs/:id</code>

### Create one job
<code>POST /jobs</code>

#### Body
<pre>
{
    title: String
}
</pre>

### Update one job
<code>PUT /jobs/:id</code>

#### Body
<pre>
{
    title?: String
}
</pre>

### Delete one job
<code>DELETE /jobs/:id</code>

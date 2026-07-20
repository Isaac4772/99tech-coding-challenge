# Problem 5 — Task CRUD API

An Express + Prisma (PostgreSQL) service for managing tasks.

Setup and running instructions live in the [root readme](../../readme.md#problem-5--task-crud-api).

The server listens on `http://localhost:8000` (override with `PORT`). Interactive
docs are available at [`/docs`](http://localhost:8000/docs) (Swagger UI) and the
raw spec at [`/openapi.json`](http://localhost:8000/openapi.json).

## Response envelope

Every endpoint returns a consistent JSON envelope:

```jsonc
// success
{ "success": true, "data": { /* ... */ } }

// error
{ "success": false, "error": { "message": "…", "issues": [ /* optional, validation only */ ] } }
```

A `Task` looks like:

```jsonc
{
  "id": "018f6bc3-40cc-725b-9e79-f7b0f46c237b",
  "title": "Write the README",
  "description": "Cover setup and usage",   // nullable
  "status": "pending",                        // "pending" | "completed"
  "createdAt": "2026-07-20T10:00:00.000Z",
  "updatedAt": "2026-07-20T10:00:00.000Z"
}
```

## Endpoints

### Utility

| Method | Path            | Description                        |
| ------ | --------------- | ---------------------------------- |
| `GET`  | `/healthz`      | Health check, returns `OK`.        |
| `GET`  | `/docs`         | Swagger UI.                        |
| `GET`  | `/openapi.json` | OpenAPI spec.                      |

### Tasks

| Method   | Path         | Description        | Success        |
| -------- | ------------ | ------------------ | -------------- |
| `POST`   | `/tasks`     | Create a task.     | `201 Created`  |
| `GET`    | `/tasks`     | List all tasks.    | `200 OK`       |
| `GET`    | `/tasks/:id` | Get one task.      | `200 OK`       |
| `PATCH`  | `/tasks/:id` | Update a task.     | `200 OK`       |
| `DELETE` | `/tasks/:id` | Delete a task.     | `200 OK`       |

---

#### `POST /tasks`

Create a task.

**Body**

| Field         | Type   | Required | Notes                 |
| ------------- | ------ | -------- | --------------------- |
| `title`       | string | yes      | Non-empty.            |
| `description` | string | no       | Optional.             |

```sh
curl -X POST http://localhost:8000/tasks \
  -H 'Content-Type: application/json' \
  -d '{ "title": "Write the README", "description": "Cover setup and usage" }'
```

Returns `201` with the created task. Returns `400` if the body fails validation.

---

#### `GET /tasks`

List all tasks.

```sh
curl http://localhost:8000/tasks
```

Returns `200` with an array of tasks in `data`.

---

#### `GET /tasks/:id`

Fetch a single task by id (UUID).

```sh
curl http://localhost:8000/tasks/018f6bc3-40cc-725b-9e79-f7b0f46c237b
```

Returns `200` with the task, `400` if `id` is not a valid UUID, or `404` if no
task exists with that id.

---

#### `PATCH /tasks/:id`

Partially update a task. Provide **at least one** of the fields below.

**Body**

| Field         | Type                        | Notes                          |
| ------------- | --------------------------- | ------------------------------ |
| `title`       | string                      | Non-empty.                     |
| `description` | string \| null              | `null` clears the description. |
| `status`      | `"pending"` \| `"completed"`| Task lifecycle status.         |

```sh
curl -X PATCH http://localhost:8000/tasks/018f6bc3-40cc-725b-9e79-f7b0f46c237b \
  -H 'Content-Type: application/json' \
  -d '{ "status": "completed" }'
```

Returns `200` with the updated task, `400` if `id`/body is invalid (including an
empty body), or `404` if the task does not exist.

---

#### `DELETE /tasks/:id`

Delete a task by id.

```sh
curl -X DELETE http://localhost:8000/tasks/018f6bc3-40cc-725b-9e79-f7b0f46c237b
```

Returns `200` with the deleted task, `400` if `id` is not a valid UUID, or `404`
if the task does not exist.

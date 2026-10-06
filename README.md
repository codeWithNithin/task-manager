# Task Manager API

A small Express REST API for managing tasks, with file-backed JSON storage instead of a
database. Requests flow through four layers: **route → validator → controller → repository**.

## Requirements

Node.js 18 or newer.

## Setup

```bash
npm install
```

## Running the server

```bash
npm run dev
```

Starts on [http://localhost:3000](http://localhost:3000) with file watching, so it restarts
on save.

`app.js` only calls `app.listen()` when it is the entry point (`require.main === module`) and
exports the app otherwise. That is what lets the tests import the app without opening a port —
without the guard, the listening socket keeps the Node process alive and the test run hangs.

## Running the tests

```bash
npm test
```

Expected: `total: 19, pass: 19`, exit code `0`.

Two details about how this is wired:

- **`pretest` resets `task.json` from git.** The test suite writes to the live data file, so
  without a reset the second run would fail.
- **Tests run via `node test/server.test.js`, not the `tap` runner.** `tap` 18.6.1 spawns each
  test file with `--import=@tapjs/processinfo/...`, which hangs silently on Node 20+ (a trivial
  `t.equal(1, 1)` produces zero output and dies on a 30s timeout). Running the file directly
  uses the same `tap` library for assertions and TAP output, and reports the real exit code.

## Project structure

```
app.js                              Express app, loads data, starts server when run directly
routes/tasks.route.js               URL → handler mapping
controllers/task.controllers.js     Request handling and HTTP status codes
repositories/task.repository.js     Reads/writes task.json (the "database")
validators/incomingRequest.validator.js   Body validation for POST and PUT
test/server.test.js                 API tests (tap + supertest)
task.json                           Seed data / persistent store
```

## Data model

```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true
}
```

`id` is a number, `completed` is a boolean. Storage is a `{ "tasks": [...] }` object.

## Endpoints

All routes are mounted under `/tasks`.

| Method   | Path         | Success             | Failure                       |
| -------- | ------------ | ------------------- | ----------------------------- |
| `GET`    | `/tasks`     | `200` + task array  | —                             |
| `GET`    | `/tasks/:id` | `200` + task        | `404` invalid task id         |
| `POST`   | `/tasks`     | `201` + created task| `400` invalid body            |
| `PUT`    | `/tasks/:id` | `200` + `{message, task}` | `400` invalid body, `404` invalid id |
| `DELETE` | `/tasks/:id` | `200` + `{message}` | `404` invalid task id         |

### Examples

```bash
# List all tasks
curl http://localhost:3000/tasks

# Get one task
curl http://localhost:3000/tasks/1

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write docs","description":"Document the API","completed":false}'

# Update a task (all three fields are required)
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Updated description","completed":true}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/1
```

## Validation

`POST /tasks` and `PUT /tasks/:id` run `validateIncomingRequest`, which returns `400` with a
`message` describing the first problem found:

- `title` — required, must be a non-empty string
- `description` — required, must be a non-empty string
- `completed` — required, must be a boolean (so `"true"` is rejected)

```json
{ "message": "title is missing or title has invalid data" }
```

## Notes and limitations

- **`task.json` is the live database.** Every create, update, and delete writes to it, so `git
  status` will show it modified after any request. This is expected.
- **IDs are reused after deletion.** `createTask` assigns `data.length + 1`, so deleting the
  highest-numbered task lets a later create reuse that ID. Use `Math.max(...ids) + 1` instead.
- **Storage path is relative** (`./task.json`), resolved from the current working directory.
  Always run from the project root.
- **Single-process only.** All state is in module memory, so writes from multiple processes or
  instances would overwrite each other.

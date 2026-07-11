# Kaban API — Frontend Integration Guide

> **Base URL (Development):** `http://localhost:3000`
> **Base URL (Production):** `https://api.kaban.com.ng`
> **Interactive Docs (Swagger):** `{baseUrl}/api`

All request bodies must be `Content-Type: application/json`. All IDs are **UUID v4** strings.

---

## Data Models

### Board

```ts
{
  id: string;           // UUID
  name: string;
  taskLists: TaskList[];
  createdAt: string;    // ISO 8601
  updatedAt: string;
}
```

### TaskList

```ts
{
  id: string;           // UUID
  name: string;         // e.g. "Todo", "Doing", "Done"
  position: number;     // ordering index, default 0
  board: Board;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
```

### Task

```ts
{
  id: string;           // UUID
  title: string;
  description: string;
  position: number;     // ordering index within the list
  dueDate: string | null; // ISO 8601 date string
  priority: "low" | "medium" | "high"; // default: "medium"
  taskList: TaskList;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}
```

### Subtask

```ts
{
  id: string; // UUID
  description: string;
  isCompleted: boolean; // default: false
  createdAt: string;
  updatedAt: string;
}
```

### Delete Response

```ts
{
  message: string;
}
```

---

## Enums

### Task Priority

| Value      | Description               |
| ---------- | ------------------------- |
| `"low"`    | Low priority              |
| `"medium"` | Medium priority (default) |
| `"high"`   | High priority             |

### Task Status (used to assign tasks to lists by name)

| Value     | Resolves to list named        |
| --------- | ----------------------------- |
| `"Todo"`  | The "Todo" list on the board  |
| `"Doing"` | The "Doing" list on the board |
| `"Done"`  | The "Done" list on the board  |

> **Note:** Status values are case-sensitive and must match the list name exactly.

---

## Boards

### Create a Board

`POST /boards`

Automatically creates the board with **three default task lists**: `Todo`, `Doing`, and `Done`.

**Request body:**

```json
{
  "name": "My Project"
}
```

**Response:** `Board` (with `taskLists` included)

---

### Get All Boards

`GET /boards`

Returns all boards with their task lists. Ordered by newest first.

**Response:** `Board[]`

---

### Get a Board by ID

`GET /boards/:id`

Returns a single board with its full nested structure: task lists → tasks → subtasks.

**Response:** `Board`

**Error:** `404` if board not found.

---

### Update a Board

`PATCH /boards/:id`

**Request body** (all fields optional):

```json
{
  "name": "Updated Board Name"
}
```

**Response:** `Board` (with `taskLists`)

**Error:** `404` if board not found.

---

### Delete a Board

`DELETE /boards/:id`

Deletes the board and **cascades** to all its task lists and tasks.

**Response:**

```json
{ "message": "Board 'My Project' deleted successfully" }
```

**Error:** `404` if board not found.

---

## Task Lists

### Create a Task List

`POST /task-lists`

Creates a standalone list attached to a board. No tasks required.

**Request body:**

```json
{
  "name": "Backlog",
  "boardId": "board-uuid-here",
  "position": 3
}
```

| Field      | Type          | Required                       | Description |
| ---------- | ------------- | ------------------------------ | ----------- |
| `name`     | string        | The display name of the list   |
| `boardId`  | string (UUID) | The board this list belongs to |
| `position` | number        | Ordering index (default: `0`)  |

**Response:** `TaskList`

---

### Get All Task Lists

`GET /task-lists`

Returns all task lists with their board and tasks (+ subtasks). Ordered by `position` then `createdAt`.

**Response:** `TaskList[]`

---

### Get a Task List by ID

`GET /task-lists/:id`

**Response:** `TaskList` (with `board`, `tasks`, and `subtasks`)

**Error:** `404` if list not found.

---

### Update a Task List

`PATCH /task-lists/:id`

> **Note:** You cannot change the `boardId` (re-parenting a list is not supported).

**Request body** (all fields optional):

```json
{
  "name": "In Review",
  "position": 2
}
```

**Response:** `TaskList`

**Error:** `404` if list not found.

---

### Delete a Task List

`DELETE /task-lists/:id`

Deletes the list and **cascades** to all its tasks.

**Response:**

```json
{ "message": "Task list 'Backlog' deleted successfully" }
```

**Error:** `404` if list not found.

---

## Tasks

### Create a Task

`POST /tasks`

Two ways to assign a task to a list:

#### Option A — By `taskListId` (direct)

```json
{
  "title": "Design login screen",
  "description": "Create mockups for the login flow",
  "taskListId": "task-list-uuid-here",
  "priority": "high",
  "dueDate": "2026-08-01",
  "position": 0
}
```

#### Option B — By `status` + `boardId` (resolves the list automatically)

```json
{
  "title": "Design login screen",
  "description": "Create mockups for the login flow",
  "status": "Todo",
  "boardId": "board-uuid-here",
  "priority": "high",
  "dueDate": "2026-08-01"
}
```

| Field         | Type                              | Required                                               | Description |
| ------------- | --------------------------------- | ------------------------------------------------------ | ----------- |
| `title`       | string                            | Task title                                             |
| `description` | string                            | Task description                                       |
| `taskListId`  | string (UUID)                     | Required if `status`/`boardId` not provided            |
| `status`      | `"Todo"` \| `"Doing"` \| `"Done"` | Required (with `boardId`) if `taskListId` not provided |
| `boardId`     | string (UUID)                     | Required (with `status`) if `taskListId` not provided  |
| `priority`    | `"low"` \| `"medium"` \| `"high"` | Default: `"medium"`                                    |
| `dueDate`     | string (ISO date)                 | e.g. `"2026-08-01"`                                    |
| `position`    | number                            | Ordering index within the list                         |

**Response:** `Task`

**Errors:**

- `400` — Neither `taskListId` nor both `status`+`boardId` provided
- `404` — No list matching the given `status` on that board

---

### Get All Tasks

`GET /tasks`

Returns all tasks with their list, board, and subtasks. Ordered by `position` then `createdAt`.

**Response:** `Task[]`

---

### Get a Task by ID

`GET /tasks/:id`

**Response:** `Task` (with `taskList`, `board`, and `subtasks`)

**Error:** `404` if task not found.

---

### Update a Task

`PATCH /tasks/:id`

All fields are optional. You can also **move a task to a different list** using `status`+`boardId` — the same resolution logic as `create` applies.

**Request body examples:**

Update title and priority:

```json
{
  "title": "Updated title",
  "priority": "low"
}
```

Move task to "Doing" list:

```json
{
  "status": "Doing",
  "boardId": "board-uuid-here"
}
```

Move task to a specific list by ID:

```json
{
  "taskListId": "another-list-uuid"
}
```

**Response:** `Task`

**Error:** `404` if task or target list not found.

---

### Delete a Task

`DELETE /tasks/:id`

Deletes the task and its subtasks.

**Response:**

```json
{ "message": "Task 'Design login screen' deleted successfully" }
```

**Error:** `404` if task not found.

---

## Error Responses

All errors follow this shape:

```json
{
  "statusCode": 400,
  "message": "Either taskListId or both status and boardId must be provided",
  "error": "Bad Request"
}
```

| Status | Meaning                                                         |
| ------ | --------------------------------------------------------------- |
| `400`  | Bad request — missing or invalid fields                         |
| `404`  | Resource not found                                              |
| `422`  | Validation failed (e.g. invalid UUID format for an `:id` param) |

---

## Quick Reference

| Resource  | Create             | List All          | Get One               | Update                  | Delete                   |
| --------- | ------------------ | ----------------- | --------------------- | ----------------------- | ------------------------ |
| Board     | `POST /boards`     | `GET /boards`     | `GET /boards/:id`     | `PATCH /boards/:id`     | `DELETE /boards/:id`     |
| Task List | `POST /task-lists` | `GET /task-lists` | `GET /task-lists/:id` | `PATCH /task-lists/:id` | `DELETE /task-lists/:id` |
| Task      | `POST /tasks`      | `GET /tasks`      | `GET /tasks/:id`      | `PATCH /tasks/:id`      | `DELETE /tasks/:id`      |

# CampusConnect REST API

The CampusConnect backend exposes REST endpoints for announcements, events, clubs, and authentication. This document serves as the contract for the current implementation.

## Base URL
```
/api/v1
```
All examples assume the backend is running locally at `http://localhost:4000`.

## Authorization
- Protected endpoints expect a JWT in the `Authorization` header: `Bearer <token>`.
- Tokens are generated during `POST /auth/register` or `POST /auth/login` responses.

## Common Response Shape
```jsonc
{
  "data": {},
  "success": true,
  "message": "Optional human readable note"
}
```
Errors follow:
```jsonc
{
  "success": false,
  "message": "Short error summary",
  "errors": { "field": "Validation details (optional)" }
}
```

## Health Check & Static Assets
- `GET /api/health` → `{ success: true }`
- Uploaded images are served from `/images/<filename>`.

---

## Authentication
### POST `/auth/register`
Creates a new user.

**Request Body**
```json
{
  "name": "Jane Doe",
  "email": "jane@school.edu",
  "password": "supersecret",
  "role": "student",
  "department": "Computer Science",
  "year": 3
}
```
**Response** (`201`)
```json
{
  "data": {
    "user": { "_id": "...", "name": "Jane Doe", "email": "jane@school.edu", "role": "student" },
    "token": "<jwt>"
  },
  "success": true,
  "message": "Registration successful"
}
```

### POST `/auth/login`
Authenticates an existing user.

**Request Body**
```json
{ "email": "jane@school.edu", "password": "supersecret" }
```

**Response** (`200`) matches register response.

### GET `/auth/me`
Returns the authenticated user (requires token).

### POST `/auth/logout`
Stateless logout that simply returns success (client removes token).

---

## Announcements
Announcements capture campus-wide updates. Creation requires authentication.

### GET `/announcements`
Query params:
- `category` (optional): `academic|event|administrative|club|general`
- `page` (default `1`)
- `limit` (default `20`, max `50`)

**Sample Response**
```json
{
  "data": {
    "items": [
      {
        "_id": "...",
        "title": "Midterm Schedule",
        "content": "Week 8 exams...",
        "category": "academic",
        "author": {
          "_id": "...",
          "name": "Prof. Malik",
          "email": "malik@school.edu",
          "role": "faculty"
        },
        "isPinned": false,
        "tags": ["exam", "schedule"],
        "createdAt": "2024-03-04T18:25:43.511Z"
      }
    ],
    "pagination": {
      "total": 32,
      "page": 1,
      "pages": 2
    }
  },
  "success": true
}
```

### GET `/announcements/category/:category`
Alias for the filter above (supports pagination query params).

### GET `/announcements/:id`
Returns a single announcement.

### POST `/announcements`
Body rules:
```json
{
  "title": "5-200 chars",
  "content": "10-5000 chars",
  "category": "enum listed above",
  "isPinned": false,
  "tags": ["Max 10 tags", "2-30 chars each"]
}
```
Response mirrors `GET /announcements/:id` plus `message` field.

---

## Events
Events describe scheduled happenings. Image uploads use `multipart/form-data` with the field name `image`. The stored filename is returned as `imagePath` (accessible under `/images/<imagePath>`).

### GET `/events`
Query params: `category`, `page`, `limit` (same semantics as announcements). Items include organizer info and attendee IDs.

### GET `/events/:id`
Returns a full event document with populated organizer & attendees.

### POST `/events`
Requires auth.

**Multipart Body Fields**
- `title`, `description`, `location`, `category`
- `startDate` (ISO8601 future date)
- `endDate` (after `startDate`)
- `maxAttendees` (optional integer)
- `tags[]` (optional up to 10)
- `image` (optional file)

Response: newly created event with populated organizer and stored `imagePath` (relative filename).

---

## Clubs
Clubs represent student organizations.

### GET `/clubs`
Returns all clubs with member summaries.

### GET `/clubs/:id`
Detailed club info plus members.

### POST `/clubs`
Requires auth; automatically adds the creator as the first member. Accepts the following body:
```json
{
  "name": "AI Society",
  "description": "Weekly ML meetups",
  "category": "technical",
  "contactEmail": "aisociety@campus.edu"
}
```
Optional `image` upload is handled the same way as the events endpoint.

---

## Validation & Error Codes
- `400 Bad Request`: validation failures (see `errors` object for details).
- `401 Unauthorized`: missing/invalid token.
- `403 Forbidden`: reserved for future role checks.
- `404 Not Found`: unknown resource IDs or routes.
- `409 Conflict`: unique constraints such as duplicate email or club name.
- `500 Internal Server Error`: unhandled server issues.

All validation is centralized via `express-validator`, so frontend errors are consistent and machine readable.

---

## Environment Variables
Create `Server/.env` using:
```
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<secret>
CORS_ORIGIN=http://localhost:5173
IMAGE_BASE_PATH=../images
```

---

## Roadmap / TODO
- Add pagination & search for clubs
- Attendance mutations (`/events/:id/attend`)
- Role-based permissions for admins vs. students
- Email notifications/webhooks for pinned announcements

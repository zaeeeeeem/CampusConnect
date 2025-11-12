# CampusConnect API Reference (v1)

Exhaustive REST contract for the CampusConnect backend. Defaults assume local dev at `http://localhost:4000/api/v1`. All timestamps are ISO 8601. Unless stated otherwise, send/receive `application/json`.

---
## 0. Global Rules
- **Authentication:** `Authorization: Bearer <jwt>` header for every non-public endpoint.
- **Roles:** `student`, `faculty`, `club_admin`, `admin`. Authorization checks are documented per endpoint.
- **Pagination defaults:** `page=1`, `limit=20`, `limit≤50`.
- **Uploads:** use `multipart/form-data` when attaching files. Image endpoints expect `image` or `avatar` file field; certificates generated server-side.
- **Static assets:** `/images/<filename>` serves uploaded media.
- **User objects:** All user payloads include `clubId` (if linked) and a populated `club` object with `{ _id, name, category }`.
- **Environment variables:**
  ```env
  PORT=4000
  MONGODB_URI=mongodb+srv://<user>:<pass>@cluster/db
  JWT_SECRET=<long_random_string>
  CORS_ORIGIN=http://localhost:5173
  IMAGE_BASE_PATH=../images
  CERTIFICATES_PATH=../certificates
  ```
- **Response envelope:**
  ```jsonc
  {
    "data": {},
    "success": true,
    "message": "Optional human-readable note"
  }
  ```
- **Error envelope:**
  ```jsonc
  {
    "success": false,
    "message": "Short error",
    "errors": { "field": "validation detail" }
  }
  ```

---
## 1. Health
### GET `/api/health`
- **Purpose:** Quick readiness probe.
- **Access:** Public.
- **Response:** `{ "success": true, "message": "CampusConnect API is up" }`

---
## 2. Authentication & Session
### POST `/auth/register`
- **Access:** Public.
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@campus.edu",
    "password": "SuperSecret9",
    "role": "student",       // optional: student|faculty|club_admin|admin
    "department": "CSE",     // optional 2-100 chars
    "year": 3,                // optional 1-6
    "clubId": "64f..."        // optional: required when creating club_admins
  }
  ```
- **Response:**
  ```jsonc
  {
    "data": {
      "user": { "_id": "...", "name": "Jane Doe", "email": "jane@campus.edu", "role": "student", "clubId": null, "club": null },
      "token": "<jwt>"
    },
    "message": "Registration successful",
    "success": true
  }
  ```

### POST `/auth/login`
- **Body:** `{ "email": "jane@campus.edu", "password": "SuperSecret9" }`
- **Response:** same shape as register.

### GET `/auth/me`
- **Headers:** `Authorization` required.
- **Response:** Authenticated user object (password stripped, includes `clubId` + `club` when applicable).

### PUT `/auth/profile`
- **Headers:** `Authorization` required.
- **Body:** subset of `{ "name", "department", "year", "bio", "interests", "clubId" }`.
- **Response:** Updated user.

### POST `/auth/logout`
- **Headers:** `Authorization` required.
- **Response:** `{ "data": true, "message": "Logout successful" }`

---
## 3. Profile APIs
### GET `/profile/:userId`
- **Access:** Any authenticated user.
- **Response:** Target user object (no password).

### PUT `/profile/:userId`
- **Access:** User editing self or Admin.
- **Body:** Same fields as `/auth/profile` (including optional `clubId`).
- **Response:** Updated profile.

### POST `/profile/upload-image`
- **Access:** Authenticated.
- **Payload:** `multipart/form-data` with file field `avatar`.
- **Response:** Updated user with `avatarPath` (relative filename, served via `/images/<avatarPath>`).

---
## 4. User Administration (Admin-only)
### GET `/users`
- **Purpose:** List all users for admin dashboards.
- **Response:** Array of users (sans passwords).

### PUT `/users/:id/role`
- **Body:** `{ "role": "club_admin", "clubId": "64f..." }` (include `clubId` whenever promoting to `club_admin`).
- **Response:** Updated user record; action logged.

### DELETE `/users/:id`
- **Response:** `{ "data": true, "message": "User removed" }`.

---
## 5. Announcements
### GET `/announcements`
- **Query params:** `category` (`academic|event|administrative|club|general`), `page`, `limit`.
- **Response:**
  ```jsonc
  {
    "data": {
      "items": [ { "_id": "...", "title": "Midterms", "author": {"name": "Prof"}, ... } ],
      "pagination": { "total": 42, "page": 1, "pages": 3 }
    }
  }
  ```

### GET `/announcements/category/:category`
- **Purpose:** Shortcut to category filter (same response structure).

### GET `/announcements/:id`
- **Response:** Single announcement (populated author).

### POST `/announcements`
- **Access:** Authenticated (role must allow creation per business rules).
- **Body:**
  ```json
  {
    "title": "Hackathon Update",   // 5-200 chars
    "content": "Details...",       // 10-5000 chars
    "category": "event",          // enum
    "isPinned": true,               // optional boolean
    "tags": ["hackathon", "2024"] // optional array ≤10 items
  }
  ```
- **Response:** Created announcement with populated author.

---
## 6. Clubs & Societies
### GET `/clubs`
- **Access:** Public.
- **Response:** Array of clubs with member counts (members minimally populated with name/email/role).

### GET `/clubs/:id`
- **Response:** Full club document with populated `members` & `admins`.

### POST `/clubs`
- **Access:** Admin.
- **Payload:** `multipart/form-data` if including `image`; otherwise JSON matching:
  ```jsonc
  {
    "name": "AI Society",          // 3-100 chars
    "description": "Weekly ML meets", // 10-1000 chars
    "category": "technical",
    "contactEmail": "ai@campus.edu",
    "adminIds": ["<clubAdminId>"], // optional, ensures these users are admins+members
    "members": ["<userId>"]        // optional initial members
  }
  ```
- **Response:** Club with populated members/admins; creator recorded in `createdBy`.

### PUT `/clubs/:id`
- **Access:** Club Admin for that club or Admin.
- **Payload:** Same fields as create (all optional). File field `image` replaces `imagePath` if provided.
- **Response:** Updated club (members/admins populated).

### DELETE `/clubs/:id`
- **Access:** Admin.
- **Response:** `{ "data": true, "message": "Club deleted" }`.

### GET `/clubs/:id/members`
- **Access:** Club/Admin.
- **Response:** Array of member profiles (name/email/role).

### POST `/clubs/:id/add-member`
- **Access:** Club/Admin.
- **Body:** `{ "userId": "<userId>" }`.
- **Response:** Updated member list.

### DELETE `/clubs/:id/remove-member/:userId`
- **Access:** Club/Admin.
- **Response:** Updated member list after removal.

---
## 7. Events & Feedback
### GET `/events`
- **Query:** `category`, `page`, `limit`.
- **Response:**
  ```jsonc
  {
    "data": {
      "items": [
        {
          "_id": "...",
          "title": "Hackathon",
          "organizer": { "name": "Alice" },
          "club": { "name": "AI Society" },
          "startDate": "2025-05-12T09:00:00.000Z",
          "status": "scheduled"
        }
      ],
      "pagination": { "total": 5, "page": 1, "pages": 1 }
    }
  }
  ```

### GET `/events/:id`
- **Response:** Event with populated `organizer`, `club`, and `attendees` (names/emails).

### POST `/events`
- **Access:** Club Admin of referenced club or Admin.
- **Payload:** `multipart/form-data` if sending `image`.
  ```jsonc
  {
    "title": "Hackathon 2025",
    "description": "48 hour build",
    "clubId": "<clubId>",
    "category": "technical",
    "location": "Auditorium",
    "startDate": "2025-05-12T09:00:00.000Z",
    "endDate": "2025-05-13T09:00:00.000Z",
    "registrationDeadline": "2025-05-10T23:59:00.000Z",
    "maxAttendees": 200,
    "tags": ["hackathon", "2025"],
    "status": "scheduled"
  }
  ```
- **Response:** Created event with populated `organizer` (`name/email/role/department`) and `club`.

### PUT `/events/:id`
- **Access:** Club/Admin.
- **Payload:** Any subset of event fields; `image` field to replace image.
- **Response:** Updated event with populated refs.

### DELETE `/events/:id`
- **Access:** Club/Admin.
- **Response:** `{ "data": true, "message": "Event removed" }`.

### POST `/events/:id/register`
- **Access:** Student role.
- **Response:** `{ "data": true, "message": "Registration successful" }`.
- **Rules enforced:** Must not already be registered, event cannot be full, `registrationDeadline` must be in future.

### GET `/events/:id/participants`
- **Access:** Club/Admin for that event.
- **Response:** List of attendees (name/email/role).

### POST `/events/:id/feedback`
- **Access:** Student who attended the event.
- **Body:** `{ "rating": 4, "comment": "Great session" }`.
- **Response:** Upserted feedback entry.

### GET `/events/:id/feedback`
- **Access:** Club/Admin.
- **Response:** Array of feedback items (each with `user` info, rating, comment, timestamps).

### DELETE `/feedback/:id`
- **Access:** Admin.
- **Response:** `{ "data": true, "message": "Feedback deleted" }`.

---
## 8. Notifications
### GET `/notifications`
- **Access:** Any authenticated user.
- **Query params:** `clubId` (optional filter).
- **Response:** Array filtered so user only sees notifications targeting either their role or everyone (empty `targetRoles`).

### GET `/notifications/:id`
- **Checks:** Same visibility rules as list; returns 403 if user role not allowed.

### POST `/notifications`
- **Access:** Club Admin / Admin.
- **Body:**
  ```jsonc
  {
    "title": "Event Reminder",      // 3-150 chars
    "message": "See you Friday",    // 5-1000 chars
    "link": "https://event.page",   // optional string/URL
    "targetRoles": ["student"],     // optional array
    "club": "<clubId>"              // optional
  }
  ```
- **Response:** Created notification (with `_id`, timestamps).

### PUT `/notifications/:id`
- **Access:** Admin or originating Club Admin.
- **Body:** Same fields as create (partial allowed).
- **Response:** Updated notification.

### DELETE `/notifications/:id`
- **Access:** Admin.
- **Response:** `{ "data": true, "message": "Notification deleted" }`.

---
## 9. Certificates
### POST `/certificates/generate/:eventId`
- **Access:** Club Admin for event’s club or Admin.
- **Action:** Generates/updates certificate PDFs for every attendee; stores filenames.
- **Response:** Array of certificate records (`event`, `user`, `fileName`, `issuedAt`).

### GET `/certificates`
- **Access:** Authenticated user (returns only their certificates).
- **Response:** Array with event reference (title/startDate) plus file names.

### GET `/certificates/:userId/:eventId`
- **Access:** Owner (`userId` matches current user) or Admin.
- **Response:** Streams PDF file stored at `${CERTIFICATES_PATH}/<fileName>`.

### DELETE `/certificates/:id`
- **Access:** Admin.
- **Response:** `{ "data": true, "message": "Certificate deleted" }` (file is removed from disk as well).

---
## 10. Admin Dashboard
### GET `/admin/stats`
- **Access:** Admin.
- **Response:**
  ```json
  {
    "data": {
      "userCount": 1200,
      "clubCount": 18,
      "eventCount": 42,
      "feedbackCount": 95
    }
  }
  ```

### GET `/admin/logs?limit=50`
- **Access:** Admin.
- **Response:** Most recent activity logs (actions like `club.create`, `event.update`, `certificates.generate`). Each item includes actor info, entity, metadata, timestamps.

---
## 11. Manual Testing Checklist
Refer to `docs/TESTING_STRATEGY.md` for a Postman collection guide that seeds users, clubs, events, and runs through every write-heavy endpoint (register/login → profile → clubs → events → feedback → notifications → certificates → admin views).

---
**Need more detail or schema exports (OpenAPI/Swagger)?** File an issue and the backend team can publish machine-readable specs.

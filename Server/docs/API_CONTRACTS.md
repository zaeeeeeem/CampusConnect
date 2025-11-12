# CampusConnect REST API (v1)

The backend exposes secured REST endpoints under the `/api/v1` prefix. All responses follow the uniform shape:

```jsonc
{
  "data": { /* payload */ },
  "success": true,
  "message": "Optional human friendly detail"
}
```

Errors:
```jsonc
{
  "success": false,
  "message": "Short reason",
  "errors": { "field": "Validation detail" }
}
```

Authentication uses JWT bearer tokens: `Authorization: Bearer <token>`.

Static assets:
- Uploaded images are served from `/images/<filename>`.
- Certificate PDFs live in `/certificates/<filename>` internally and are fetched through the certificate endpoints.

Environment variables (`Server/.env`):
```
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<secret>
CORS_ORIGIN=http://localhost:5173
IMAGE_BASE_PATH=../images
CERTIFICATES_PATH=../certificates
```

---

## 1. Auth & Profile

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/auth/register` | Create student/faculty/club admin account | Public |
| POST | `/auth/login` | Obtain JWT | Public |
| GET | `/auth/me` or `/auth/profile` | Current authenticated user | Authenticated |
| PUT | `/auth/profile` | Update own core fields (name, dept, year, bio, interests) | Authenticated |
| POST | `/auth/logout` | Stateless logout acknowledgment | Authenticated |

**Register request**
```json
{
  "name": "Jane Doe",
  "email": "jane@campus.edu",
  "password": "supersecret",
  "role": "student",
  "department": "Computer Science",
  "year": 3
}
```

**Profile management**
- `GET /profile/:userId` – fetch any profile (auth required).
- `PUT /profile/:userId` – update profile if owner or admin.
- `POST /profile/upload-image` – upload avatar (`multipart/form-data` with `avatar` file field). Returns updated user with `avatarPath` pointing to `/images/<file>`.

---

## 2. User Administration

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/users` | List all users | Admin |
| PUT | `/users/:id/role` | Promote/demote user (`student`, `faculty`, `club_admin`, `admin`) | Admin |
| DELETE | `/users/:id` | Remove user | Admin |

---

## 3. Clubs & Societies

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/clubs` | Create new club/society. Body includes `name`, `description`, `category`, `contactEmail`, optional `adminIds[]`, `members[]`, `image`. Creator is recorded in `createdBy`. | Admin |
| GET | `/clubs` | List clubs with members summary | Public |
| GET | `/clubs/:id` | Club detail (members + admins) | Public |
| PUT | `/clubs/:id` | Update metadata or image | Club Admin of that club / Admin |
| DELETE | `/clubs/:id` | Delete club | Admin |
| GET | `/clubs/:id/members` | List membership roster | Club Admin / Admin |
| POST | `/clubs/:id/add-member` | Add user by `userId` | Club Admin / Admin |
| DELETE | `/clubs/:id/remove-member/:userId` | Remove user from club | Club Admin / Admin |

Implementation notes:
- A club keeps both `admins[]` (who can manage) and `members[]`.
- Creating a club automatically seeds `admins` (creator + `adminIds`) and ensures they are members.

---

## 4. Event Management

Events belong to clubs and are managed by club admins or global admins.

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/events` | Create event for a club. Accepts multipart body with image (`image` field) and fields: `title`, `description`, `clubId`, `category`, `location`, `startDate`, `endDate`, `registrationDeadline?`, `maxAttendees?`, `tags[]?`, `status?`. | Club Admin of club / Admin |
| GET | `/events` | List events with optional `category`, `page`, `limit` filters | Public |
| GET | `/events/:id` | Event detail with organizer + club data | Public |
| PUT | `/events/:id` | Update event fields/image | Club Admin / Admin |
| DELETE | `/events/:id` | Remove event | Club Admin / Admin |
| POST | `/events/:id/register` | Student registration (auto-blocked if duplicate, deadline passed, or full) | Student |
| GET | `/events/:id/participants` | List attendees | Club Admin / Admin |

### Feedback

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/events/:id/feedback` | Submit rating (1–5) + optional comment. User must be a registered attendee. | Student attendee |
| GET | `/events/:id/feedback` | View feedback entries with user info | Club Admin / Admin |
| DELETE | `/feedback/:id` | Remove inappropriate feedback | Admin |

---

## 5. Notification Center

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/notifications` | Create notification with `title`, `message`, optional `link`, `targetRoles[]`, `club` | Club Admin / Admin |
| GET | `/notifications` | List notifications visible to requesting user's role/club | Authenticated |
| GET | `/notifications/:id` | Fetch single notification (visibility enforced) | Authenticated |
| PUT | `/notifications/:id` | Update notification content/targets | Creator Club Admin / Admin |
| DELETE | `/notifications/:id` | Delete notification | Admin |

Visibility rules: notifications without `targetRoles` are public; otherwise requester must match a target role or be admin.

---

## 6. Certificates

Certificates are generated as landscape PDFs stored inside `CERTIFICATES_PATH`.

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/certificates/generate/:eventId` | Generate PDFs for all attendees of the event. Each attendee receives/upserts one certificate. | Club Admin of event’s club / Admin |
| GET | `/certificates` | List certificates for logged-in user | Authenticated |
| GET | `/certificates/:userId/:eventId` | Download a specific certificate (self or admin) | Owner / Admin |
| DELETE | `/certificates/:id` | Remove certificate record + file | Admin |

Implementation tip: certificate filenames follow `slugifiedEvent_slugifiedUser_timestamp.pdf`. PDFs show event title, attendee name, and event date.

---

## 7. Admin Dashboard

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/admin/stats` | Returns `{ userCount, clubCount, eventCount, feedbackCount }` |
| GET | `/admin/logs` | Paginated (query `limit`, default 50) activity logs capturing key actions (club/event/certificate/user ops) |

Activity log schema:
```jsonc
{
  "user": { "_id": "...", "name": "" },
  "action": "event.create",
  "entity": "Event",
  "entityId": "...",
  "metadata": { "club": "..." },
  "createdAt": "2024-06-01T12:00:00Z"
}
```

---

## 8. Role Matrix

| Role | Capabilities |
| ---- | ------------ |
| Student | Register for events, submit feedback, view notifications and certificates, manage own profile |
| Faculty | Same as students (future extensions can grant limited club/event permissions) |
| Club Admin | Everything a student can do, plus manage their clubs, create/update events, notifications, and generate certificates |
| Admin | Global CRUD over users, clubs, events, notifications, feedback, certificates, and access to stats/logs |

---

## 9. Validation Highlights

- **Announcements**: unchanged (title 5–200 chars, etc.).
- **Clubs**: `name`, `description`, `category`, `contactEmail` required. Optional `adminIds[]`, `members[]` must be valid Mongo IDs.
- **Events**: require `clubId`, ISO8601 dates (`startDate` future, `endDate` after `startDate`, `registrationDeadline` ≤ `startDate`), optional `status` (`scheduled|completed|cancelled`).
- **Feedback**: rating 1–5, comment ≤ 1000 chars.
- **Notifications**: `title` 3–150 chars, `message` up to 1000 chars, optional `targetRoles[]`.
- **Profiles**: `bio` ≤ 500 chars, `interests[]` max 20 entries.

---

## 10. Suggested Next Steps

- Hook frontend views to these endpoints (see role matrix for gating UI controls).
- Extend tests (Supertest + Mongo-memory) to cover role guards and PDF generation.
- Consider background job for email notifications when new notifications are created.

# CampusConnect API Manual Test Plan (Postman)

The goal is to exercise all write-heavy endpoints end-to-end using Postman before wiring up automated tests. Follow the flow in order so each step seeds data for the next.

## 0. Setup
1. Create a Postman environment with these variables:
   - `baseUrl` = `http://localhost:4000/api/v1`
   - `adminToken`, `clubAdminToken`, `studentToken` (leave empty; will be set as you obtain JWTs)
2. Ensure MongoDB + server are running: `npm run dev` inside `Server/`.

## 1. Seed Users (Auth APIs)
1. **Register Admin**
   - POST `{{baseUrl}}/auth/register`
   - Body: `{ "name": "Alice Admin", "email": "admin@campus.edu", "password": "AdminPass1!", "role": "admin" }`
   - Save `token` response into `adminToken`.
2. **Register Club Admin** – similar payload (`role: "club_admin"`). Save token to `clubAdminToken`.
3. **Register Student** – default role `student`. Save token to `studentToken`.
4. **Login sanity** – POST `/auth/login` for each user to confirm credentials.

## 2. Profile Management
1. **Update own profile** – PUT `{{baseUrl}}/auth/profile` with `Authorization: Bearer {{studentToken}}` and body `{ "bio": "AI enthusiast", "interests": ["Robotics"] }`.
2. **Upload avatar** – POST `{{baseUrl}}/profile/upload-image` (student token) with `avatar` file.

## 3. Club Lifecycle (Admin + Club Admin)
1. **Create Club** – Admin token, POST `{{baseUrl}}/clubs` (multipart if image). Body includes `name`, `description`, `category`, `contactEmail`, optional `adminIds` (club admin userId) and `members`.
2. Record returned `_id` as `clubId` (Postman variable).
3. **Update Club** – Club admin token, PUT `/clubs/{{clubId}}` to change description.
4. **Add Member** – POST `/clubs/{{clubId}}/add-member` with `{ "userId": "<studentId>" }` using club admin token.
5. **Get Members** – GET `/clubs/{{clubId}}/members` (club admin token) to confirm addition.
6. **Remove Member** – DELETE `/clubs/{{clubId}}/remove-member/{{studentId}}`.

## 4. Event Flow
1. **Create Event** – Club admin token, POST `/events` (multipart for `image`). Include fields: `title`, `description`, `clubId`, `category`, `location`, `startDate`, `endDate`, `registrationDeadline`, `maxAttendees`.
2. Save response `_id` as `eventId`.
3. **Update Event** – PUT `/events/{{eventId}}` to change location/status.
4. **Student Registration** – Student token POST `/events/{{eventId}}/register`.
5. **View Participants** – Club admin token GET `/events/{{eventId}}/participants` confirms attendee list.

## 5. Feedback
1. **Submit Feedback** – Student token POST `/events/{{eventId}}/feedback` with `{ "rating": 5, "comment": "Great session" }`.
2. **View Feedback** – Club admin token GET `/events/{{eventId}}/feedback` to ensure entry visible.

## 6. Notifications
1. **Create Notification** – Club admin token POST `/notifications` body `{ "title": "New Meetup", "message": "Join us Friday", "targetRoles": ["student"], "club": "{{clubId}}" }`.
2. **List Notifications** – Student token GET `/notifications` to ensure targeted message appears.
3. **Update Notification** – Club admin token PUT `/notifications/{{notificationId}}` to edit message.
4. **Delete Notification** – Admin token DELETE `/notifications/{{notificationId}}`.

## 7. Certificates
1. Ensure event has at least one attendee (step 4).
2. **Generate** – Club admin token POST `/certificates/generate/{{eventId}}`.
3. **Student Fetch** – Student token GET `/certificates` and `/certificates/{{studentId}}/{{eventId}}` (should download PDF).
4. **Admin Delete** – Admin token DELETE `/certificates/{{certificateId}}`.

## 8. User Administration
1. **List Users** – Admin GET `/users`.
2. **Promote Student** – Admin PUT `/users/{{studentId}}/role` body `{ "role": "club_admin" }`.
3. **Delete User** – Admin DELETE `/users/{{studentId}}` (use a throwaway user).

## 9. Admin Dashboard
1. **Stats** – Admin GET `/admin/stats` (verify counts match created data).
2. **Activity Logs** – Admin GET `/admin/logs?limit=20` to review stored actions from earlier steps.

---

### Tips
- Use Postman collections with pre-request scripts to set `Authorization` headers automatically from the environment variables.
- Duplicate requests for different roles rather than editing headers each time.
- After major steps, hit corresponding GET endpoints to ensure reads reflect writes (e.g., `/clubs`, `/events`, `/notifications`).

Completing this checklist ensures every write path that mutates data (users, clubs, events, feedback, notifications, certificates) is validated manually before frontend integration.

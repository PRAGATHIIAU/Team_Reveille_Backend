# Team Reveille Student Core – API Documentation

## Base URL

```
https://2gzy1e8qga.execute-api.us-east-1.amazonaws.com/dev
```

| Endpoint | Full URL |
|----------|----------|
| Profile Exists | `https://2gzy1e8qga.execute-api.us-east-1.amazonaws.com/dev/api/users/me/profile-exists` |
| Profiles (CRUD) | `https://2gzy1e8qga.execute-api.us-east-1.amazonaws.com/dev/api/profiles` |
| My Profile | `https://2gzy1e8qga.execute-api.us-east-1.amazonaws.com/dev/api/profiles/me` |

---

## Authentication

All endpoints require a valid **Cognito ID token** (from Google SSO) sent in the `Authorization` header.

| Header | Value |
|--------|-------|
| **Authorization** | `Bearer <cognito_id_token>` |
| **Content-Type** | `application/json` (required for POST and PUT) |

### Token Requirements

- Use the **ID token** (not the access token)
- Token must be issued by the configured Cognito User Pool and App Client
- Tokens typically expire after 1 hour; obtain a fresh token after expiry

### Error Responses (401)

| Status | Body |
|--------|------|
| 401 | `{ "error": "UNAUTHORIZED", "message": "Missing or invalid Authorization header" }` |
| 401 | `{ "error": "UNAUTHORIZED", "message": "Invalid or expired token" }` |

---

## Endpoints

### 1. Check Profile Exists (First-Time Sign-In)

Determines whether the authenticated user has a profile. Use for redirect logic after sign-in.

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `https://2gzy1e8qga.execute-api.us-east-1.amazonaws.com/dev/api/users/me/profile-exists` |
| **Auth** | Required |
| **Request Body** | None |
| **Query Params** | None |

#### Headers

```
Authorization: Bearer <cognito_id_token>
```

#### Sample Request

```http
GET /api/users/me/profile-exists
Authorization: Bearer eyJraWQiOiJxxx...
```

#### Sample Response – 200 OK (Profile Exists)

```json
{
  "exists": true
}
```

#### Sample Response – 200 OK (First-Time User)

```json
{
  "exists": false
}
```

---

### 2. Get My Profile

Returns the current user's student profile.

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `https://2gzy1e8qga.execute-api.us-east-1.amazonaws.com/dev/api/profiles/me` |
| **Auth** | Required |
| **Request Body** | None |
| **Query Params** | None |

#### Headers

```
Authorization: Bearer <cognito_id_token>
```

#### Sample Request

```http
GET /api/profiles/me
Authorization: Bearer eyJraWQiOiJxxx...
```

#### Sample Response – 200 OK

```json
{
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "John Doe",
  "uin": "123456789",
  "major": "Computer Science",
  "classYear": "26",
  "gradDate": "2026-05",
  "linkedInUrl": "https://linkedin.com/in/johndoe",
  "resumeS3Key": "resumes/a1b2c3d4/resume.pdf",
  "createdAt": "2025-02-14T10:30:00.000Z",
  "updatedAt": "2025-02-14T12:45:00.000Z"
}
```

#### Sample Response – 404 Not Found

```json
{
  "error": "NOT_FOUND",
  "message": "Profile not found"
}
```

---

### 3. Create Profile

Creates a new student profile (first-time sign-in). Fails if the user already has a profile.

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `https://2gzy1e8qga.execute-api.us-east-1.amazonaws.com/dev/api/profiles` |
| **Auth** | Required |
| **Request Body** | JSON (see schema) |
| **Query Params** | None |

#### Headers

```
Authorization: Bearer <cognito_id_token>
Content-Type: application/json
```

#### Request Body Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name |
| `uin` | string | Yes | University Identification Number |
| `major` | string | Yes | Academic major |
| `classYear` | string | Yes | Class year (e.g. `"26"` for 2026) |
| `gradDate` | string | Yes | Graduation date (e.g. `"2026-05"`) |
| `linkedInUrl` | string | No | LinkedIn profile URL |
| `resumeS3Key` | string | No | S3 object key of uploaded resume PDF |

#### Sample Request

```http
POST /api/profiles
Authorization: Bearer eyJraWQiOiJxxx...
Content-Type: application/json

{
  "name": "Jane Smith",
  "uin": "987654321",
  "major": "Computer Engineering",
  "classYear": "26",
  "gradDate": "2026-05",
  "linkedInUrl": "https://linkedin.com/in/janesmith",
  "resumeS3Key": null
}
```

#### Sample Response – 201 Created

```json
{
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Jane Smith",
  "uin": "987654321",
  "major": "Computer Engineering",
  "classYear": "26",
  "gradDate": "2026-05",
  "linkedInUrl": "https://linkedin.com/in/janesmith",
  "resumeS3Key": null,
  "createdAt": "2025-02-14T10:30:00.000Z",
  "updatedAt": "2025-02-14T10:30:00.000Z"
}
```

#### Sample Response – 400 Bad Request (Invalid JSON)

```json
{
  "error": "BAD_REQUEST",
  "message": "Invalid JSON body"
}
```

---

### 4. Update Profile

Updates the current user's profile. Only provided fields are updated.

| Field | Value |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `https://2gzy1e8qga.execute-api.us-east-1.amazonaws.com/dev/api/profiles/me` |
| **Auth** | Required |
| **Request Body** | JSON (partial update supported) |
| **Query Params** | None |

#### Headers

```
Authorization: Bearer <cognito_id_token>
Content-Type: application/json
```

#### Request Body Schema (all fields optional)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Full name |
| `uin` | string | No | University Identification Number |
| `major` | string | No | Academic major |
| `classYear` | string | No | Class year |
| `gradDate` | string | No | Graduation date |
| `linkedInUrl` | string | No | LinkedIn profile URL |
| `resumeS3Key` | string | No | S3 object key of resume |

#### Sample Request

```http
PUT /api/profiles/me
Authorization: Bearer eyJraWQiOiJxxx...
Content-Type: application/json

{
  "linkedInUrl": "https://linkedin.com/in/janesmith-updated",
  "resumeS3Key": "resumes/a1b2c3d4/resume-v2.pdf"
}
```

#### Sample Response – 200 OK

```json
{
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Jane Smith",
  "uin": "987654321",
  "major": "Computer Engineering",
  "classYear": "26",
  "gradDate": "2026-05",
  "linkedInUrl": "https://linkedin.com/in/janesmith-updated",
  "resumeS3Key": "resumes/a1b2c3d4/resume-v2.pdf",
  "createdAt": "2025-02-14T10:30:00.000Z",
  "updatedAt": "2025-02-14T14:00:00.000Z"
}
```

#### Sample Response – 404 Not Found

```json
{
  "error": "NOT_FOUND",
  "message": "Profile not found"
}
```

---

### 5. Delete Profile

Deletes the current user's profile.

| Field | Value |
|-------|-------|
| **Method** | `DELETE` |
| **URL** | `https://2gzy1e8qga.execute-api.us-east-1.amazonaws.com/dev/api/profiles/me` |
| **Auth** | Required |
| **Request Body** | None |
| **Query Params** | None |

#### Headers

```
Authorization: Bearer <cognito_id_token>
```

#### Sample Request

```http
DELETE /api/profiles/me
Authorization: Bearer eyJraWQiOiJxxx...
```

#### Sample Response – 200 OK

```json
{
  "deleted": true
}
```

---

## Common Error Responses

| Status | Error Code | Description |
|--------|------------|-------------|
| 400 | BAD_REQUEST | Invalid JSON in request body |
| 401 | UNAUTHORIZED | Missing, invalid, or expired token |
| 404 | NOT_FOUND | Profile does not exist |
| 405 | METHOD_NOT_ALLOWED | HTTP method not supported for the path |
| 500 | INTERNAL_ERROR | Server error |

All error responses follow this structure:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description"
}
```

---

## Summary Table

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users/me/profile-exists` | Check if profile exists |
| GET | `/api/profiles/me` | Get my profile |
| POST | `/api/profiles` | Create profile |
| PUT | `/api/profiles/me` | Update profile |
| DELETE | `/api/profiles/me` | Delete profile |

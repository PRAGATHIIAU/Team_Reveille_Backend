# Team Reveille Student Core – Todo List

## Phase 1: Infrastructure & Configuration

- [ ] **1.1 Environment files** – Create `.env.example`, `.env.development` for credentials
- [ ] **1.2 Serverless setup** – Configure `serverless.yml` (Lambda, API Gateway, DynamoDB)
- [ ] **1.3 DynamoDB table** – Create `StudentProfiles` table with schema
- [ ] **1.4 JWT middleware** – Implement Cognito JWT verification for Lambda handlers

## Phase 2: API Endpoints

### Check first-time sign-in (Priority 1)

- [ ] **2.1** `GET /api/users/me/profile-exists` – Returns `{ exists: true | false }`
  - Auth: Required (JWT)
  - `exists: true` → redirect to landing, fetch profile
  - `exists: false` or 404 → redirect to profile form

### Student profile CRUD

- [ ] **2.2** `GET /api/profiles/me` – Get current user’s profile
- [ ] **2.3** `POST /api/profiles` – Create profile (first-time)
- [ ] **2.4** `PUT /api/profiles/me` – Update profile
- [ ] **2.5** `DELETE /api/profiles/me` – Delete profile (if needed)

### Resume upload (later phase)

- [ ] **2.6** `GET /api/profiles/me/presigned-url` – Get S3 presigned URL for upload
- [ ] **2.7** Profile form fields: Name, UIN, Major, Class Year, Grad Date, LinkedIn URL
- [ ] **2.8** Persist `resumeS3Key` reference in DynamoDB after upload

## Phase 3: Frontend integration

- [ ] **3.1** Replace `localStorage` placeholder in `src/lib/api.js` → `checkIsFirstTimeSignIn(user)` with real API call
- [ ] **3.2** Wire up `LandingPage.svelte` (onMount, post-OAuth callback) to backend

## Naming conventions

| Resource        | Name                   |
|----------------|------------------------|
| DynamoDB table | `StudentProfiles`      |
| Lambda (check) | `studentProfilesCheckProfileExists` |
| Lambda (CRUD)  | `studentProfilesCrud`  |

## Team Reveille – Student Core Backend

Serverless backend for the **Student Identity and Profile** system (Lambda, DynamoDB, Cognito JWT).

### Stack

- **Compute**: AWS Lambda
- **API**: API Gateway (REST)
- **Database**: DynamoDB (`StudentProfiles` table)
- **Auth**: Cognito JWT (Google SSO)

### APIs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users/me/profile-exists` | Check first-time sign-in (`{ exists: true \| false }`) |
| GET | `/api/profiles/me` | Get current user's profile |
| POST | `/api/profiles` | Create profile (first-time) |
| PUT | `/api/profiles/me` | Update profile |
| DELETE | `/api/profiles/me` | Delete profile |
| POST | `/api/resumes/upload-url` | Get presigned URL for resume upload |
| POST | `/api/resumes/complete` | Complete resume upload after S3 PUT |
| GET | `/api/resumes/me` | List my resumes (metadata only) |
| GET | `/api/resumes/{resumeId}/download-url` | Get presigned download URL |

All endpoints require `Authorization: Bearer <Cognito_ID_Token>`.

### Resume Upload (S3 Presigned URL)

PDFs never pass through Lambda. Flow:

1. **POST /api/resumes/upload-url** → returns `{ uploadUrl, resumeId, s3Key, expiresInSeconds }`
2. **PUT to `uploadUrl`** (direct to S3) with `Content-Type: application/pdf` and PDF body
3. **POST /api/resumes/complete** with `{ resumeId }` → confirms upload, updates profile

See [docs/RESUME_UPLOAD.md](docs/RESUME_UPLOAD.md) for frontend integration and curl examples.

### Environment Files

| File | Purpose |
|------|---------|
| `.env.example` | Template – copy and fill values |
| `.env.development` | Local development (gitignored) |
| `.env.production` | Production (gitignored) |

Required env vars: `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `AWS_REGION`, `STUDENT_PROFILES_TABLE`.

### Getting Started

1. Copy `.env.example` to `.env.development` and fill Cognito values.

2. Install dependencies:

```bash
npm install
```

3. Deploy:

```bash
npm run deploy
```

4. Test locally (requires env vars):

```bash
serverless invoke local -f studentProfilesCheckProfileExists -e '{"headers":{"Authorization":"Bearer <your-id-token>"}}'
```

### Todo List

See `TODO.md` for the full checklist and naming conventions.


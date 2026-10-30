# API Documentation

## Base URL and Authentication

Use the backend origin:

- Production: `https://jagasree-capstone-personalized.onrender.com`
- Local default: `http://localhost:5000`

The frontend reads the origin from `VITE_API_URL`. Protected routes require:

```http
Authorization: Bearer <JWT>
```

Email/password and Google login return a JWT that expires after one hour. Public routes do not need a token. The production `/health` endpoint returned HTTP 200 with `{"status":"ok"}` during the documented check; it reports API process health only.

## Endpoint Summary

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/health` | No | Process health only |
| `POST` | `/auth/register` | No | Create account |
| `POST` | `/auth/login` | No | Email/password sign-in |
| `POST` | `/auth/google` | No | Google ID-token sign-in; requires server configuration |
| `GET` | `/users` | No | Lists users and populates recommendation refs |
| `GET` | `/users/:id` | No | Gets one user and populates recommendation refs |
| `POST` | `/users` | No | Attempts to create a user record; currently fails because the handler omits the model's required `password` |
| `PUT` | `/users/:id` | No | Updates user fields |
| `GET` | `/recommendations` | Yes | Lists all recommendations and populates users |
| `POST` | `/recommendations` | Yes | Creates a recommendation |
| `GET` | `/recommendations/:id` | Yes | Gets one recommendation and populates its user |
| `PUT` | `/recommendations/:id` | Yes | Updates a recommendation |
| `DELETE` | `/recommendations/:id` | Yes | Deletes a recommendation |
| `GET` | `/uploads` | Yes | Lists only the authenticated user's resource metadata |
| `POST` | `/uploads` | Yes | Uploads a file and saves metadata |
| `DELETE` | `/uploads/:id` | Yes | Deletes a resource owned by the authenticated user |
| `GET` | `/uploads/:storedName` | No | Serves a static file from the uploads directory |
| `POST` | `/api/ai/autocomplete` | Yes | Gets AI topic suggestions |
| `POST` | `/api/ai/recommend` | Yes | Gets AI recommendations for a topic |

## Authentication

### `POST /auth/register`

Request JSON:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "choose-a-password"
}
```

Requires all three fields. Returns `201` with a success message and user `id`, `name`, and `email`. Duplicate email returns `409`; missing fields return `400`.

### `POST /auth/login`

Request JSON:

```json
{
  "email": "user@example.com",
  "password": "choose-a-password"
}
```

Returns `200` with `token` and user `id`, `name`, and `email`. Missing fields return `400`; invalid credentials return `401`. The JWT expires after one hour.

### `POST /auth/google`

Request JSON:

```json
{
  "credential": "<Google ID token>"
}
```

The server verifies the credential against `GOOGLE_CLIENT_ID`, checks that the Google account has a verified email, and returns a JWT and user details. Missing server configuration returns `503`; a missing credential returns `400`. This endpoint cannot complete successfully unless Google sign-in is configured on the backend; the frontend additionally needs `VITE_GOOGLE_CLIENT_ID`.

## User Records

These four generic user endpoints are currently **not protected by authentication**.

### `GET /users` and `GET /users/:id`

List users or retrieve one user. The query populates recommendation references. The model does not exclude password hashes from these query results; avoid exposing these routes with real user data.

### `POST /users`

Request JSON accepts `name`, `email`, and optional `interests`; `name` and `email` are required by the handler. However, the handler does not pass a `password` to `User.create`, while the User schema requires one. As written, this endpoint fails Mongoose validation and returns `400`. It is distinct from registration and does not apply the registration password-hashing flow.

### `PUT /users/:id`

Request JSON accepts `name`, `email`, `interests`, and `recommendations`. `name` and `email` are required. Returns `404` when the ID is not found.

## Recommendation Records

All recommendation routes require a JWT. The record schema requires `title`, `description`, `category`, and `user`; `tags` is optional and defaults to an empty list.

### `GET /recommendations`

Returns all recommendation documents with their `user` reference populated.

### `POST /recommendations`

Request JSON follows the model:

```json
{
  "title": "Introduction to Machine Learning",
  "description": "A beginner-friendly learning resource",
  "category": "course",
  "tags": ["machine learning", "beginner"],
  "user": "<MongoDB user ObjectId>"
}
```

Returns `201` and the created record. The current handler accepts the body directly; it does not automatically assign the JWT user's ID.

### `GET /recommendations/:id`

Returns one recommendation with its user populated, or `404` if no record exists.

### `PUT /recommendations/:id`

Accepts updated recommendation fields as JSON and returns the updated record, or `404` if it does not exist.

### `DELETE /recommendations/:id`

Deletes by record ID and returns a success message, or `404` if not found.

**Authorization limitation:** These routes verify that a caller has a valid JWT, but update, delete, detail, and list operations are not restricted by record ownership. The UI's edit/delete controls therefore should not be interpreted as owner-only access.

## Uploaded Resources

All resource management endpoints require a JWT. Uploads accept PDF, DOC, DOCX, PNG, and JPEG MIME types and have a 5 MB maximum size. Metadata is saved in MongoDB; binary files are stored in the API filesystem.

### `GET /uploads`

Returns the authenticated user's resources, newest first. The response includes metadata and a relative `url` such as `/uploads/<storedName>`.

### `POST /uploads`

Send `multipart/form-data` containing:

| Field | Type | Required |
|---|---|---|
| `title` | Text | Yes; non-empty |
| `description` | Text | No |
| `file` | File | Yes |

Returns `201` with the created resource and its relative file URL. Unsupported types, missing file/title, or upload errors produce an error response.

### `DELETE /uploads/:id`

Deletes a resource only when its `user` matches the authenticated user. Returns `404` if no matching resource is found.

### `GET /uploads/:storedName`

Express static middleware serves files from the upload directory without JWT authentication. This route is not owner-scoped.

## AI Endpoints

Both AI routes require a JWT and an `OPENAI_API_KEY` on the backend. Requests are made to OpenAI from the server; the API key must not be sent to the browser.

### `POST /api/ai/autocomplete`

Request JSON:

```json
{
  "query": "machine lear"
}
```

The query must contain 2 to 200 characters. Returns:

```json
{
  "suggestions": ["machine learning", "machine learning basics"]
}
```

The response contains up to five unique suggestions. Missing OpenAI configuration returns `503`; invalid input returns `400`.

### `POST /api/ai/recommend`

Request JSON:

```json
{
  "interest": "machine learning"
}
```

The interest must contain 1 to 200 characters. Returns an object with a `recommendations` array; valid items contain `title`, `description`, `category`, `tags`, and `whyRecommended`. The API asks for four, limits the response to four, and filters malformed items. Results are returned to the client but are not saved as `Recommendation` documents.

## Error and Operational Notes

- Invalid or missing JWTs are rejected by authentication middleware.
- AI provider or response errors are surfaced as `502`; missing AI configuration is `503`.
- The `/health` endpoint does not test MongoDB connectivity or external providers.
- Generic user routes are public, and recommendation record access is not owner-scoped in the current implementation.
- Production environment values are managed outside the checked-in source; their presence cannot be verified from this repository.

The Bruno requests in `docs/bruno/personalized-recommendation-api/` provide runnable examples for the routes.

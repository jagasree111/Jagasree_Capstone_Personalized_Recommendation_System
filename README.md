# Personalized Recommendation System

A full-stack learning-resource application with account authentication, community recommendations, file uploads, and AI suggestions for a topic entered by the user.

## Problem Statement

Learners may have difficulty finding useful resources among generic recommendations. The project provides a place to share learning materials and explore suggestions relevant to a topic a learner chooses.

## Proposed Solution

The application combines a React web client with a Node.js and Express API, MongoDB persistence through Mongoose, JWT authentication, optional Google sign-in, and backend calls to OpenAI for topic autocomplete and recommendation suggestions.

The AI workflow uses the topic the signed-in user enters. Although the user schema has an `interests` field, there is no profile editor or automatic recommendation ranking based on stored interests or activity yet. AI-generated suggestions are returned to the frontend and are not saved as recommendation records.

## Technology Stack

- **Frontend:** React, JavaScript, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** bcryptjs password hashing, JSON Web Tokens (JWT), and optional Google Identity Services
- **AI:** OpenAI Chat Completions API, called from the backend
- **File uploads:** Multer; files are stored under `server/uploads/`
- **Deployment:** Render
- **API request collection:** Bruno, under `docs/bruno/`
- **Tests and quality checks:** Jest tests, ESLint, and Vite production build scripts in `client/package.json`

## Architecture Overview

```text
Browser (React + Vite)
    | HTTP requests; JWT in Authorization header for protected routes
    v
Express API (Node.js)
    |-- Mongoose --------------------> MongoDB
    |-- OpenAI API -----------------> AI topic suggestions
    |-- Multer ---------------------> server/uploads/ + MongoDB metadata
    +-- bcryptjs / JWT / Google ID token verification
```

The frontend reads its API base URL from `VITE_API_URL`. The backend exposes routes for authentication, user records, recommendations, uploads, AI suggestions, and a health response. MongoDB stores user, recommendation, and uploaded-resource metadata documents. The files themselves are stored on the backend filesystem.

The `/health` endpoint only reports that the API process responds; it is not a database or end-to-end health check.

## Key Features

- Email and password registration and login. Passwords are hashed with bcryptjs, and login returns a JWT.
- Optional Google sign-in, when both client and server Google client IDs are configured.
- Authenticated recommendation listing, creation, update, and deletion API routes. The frontend displays recommendations and supports editing and deleting them.
- AI-generated topic autocomplete and recommendation suggestions for the topic submitted by the user. These routes require authentication and a backend OpenAI key.
- Authenticated learning-resource upload, listing, and deletion. The API accepts PDF, DOC, DOCX, PNG, and JPEG MIME types and limits uploads to 5 MB.
- User records can hold an interests array, but the frontend does not currently provide interest management or use the array to rank recommendations.

## Installation Instructions

Requirements: Node.js/npm and a MongoDB instance, either local or MongoDB Atlas.

```bash
git clone https://github.com/jagasree111/Jagasree_Capstone_Personalized_Recommendation_System.git
cd Jagasree_Capstone_Personalized_Recommendation_System
```

Copy the placeholder environment templates, then edit the new files with your local settings:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

In Windows PowerShell, use:

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

Install the frontend and backend dependencies:

```bash
npm --prefix server install
npm --prefix client install
```

## Environment Setup

### `server/.env`

The complete placeholder template is in [`server/.env.example`](server/.env.example).

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs; replace the example value with a long, unique value |
| `CLIENT_URL` | Allowed frontend origin for CORS, for example `http://localhost:5173` |
| `OPENAI_API_KEY` | Backend-only key required for AI autocomplete and recommendation requests |
| `OPENAI_MODEL` | OpenAI model name; the example uses `gpt-4o-mini` |
| `GOOGLE_CLIENT_ID` | Optional Google Web Client ID for server-side credential verification |
| `PORT` | Optional server port; defaults to `5000` |

The backend requires `JWT_SECRET` and exits with an explicit error if it is missing. Replace the example value before starting the server.

### `client/.env`

The complete placeholder template is in [`client/.env.example`](client/.env.example).

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | API origin; defaults in local development to `http://localhost:5000` |
| `VITE_GOOGLE_CLIENT_ID` | Optional public Google Web Client ID used by Google Identity Services |

Never put `OPENAI_API_KEY`, `JWT_SECRET`, or other private credentials in the client environment. Values with the `VITE_` prefix are included in browser bundles and are public. The [`client/.env.production`](client/.env.production) file sets the public deployed API origin; a Render build environment value can override it.

## Running the Project

Start the backend in one terminal:

```bash
npm --prefix server start
```

Start the frontend in a second terminal:

```bash
npm --prefix client run dev
```

The backend defaults to `http://localhost:5000`; Vite normally serves the frontend at `http://localhost:5173`. Check the health route with:

```bash
curl http://localhost:5000/health
```

The response should be `{"status":"ok"}` when the API process is reachable. It does not confirm MongoDB connectivity.

The Bruno requests in [`docs/bruno/personalized-recommendation-api/`](docs/bruno/personalized-recommendation-api/) provide additional endpoint examples. Main routes include:

| Method and path | Purpose |
|---|---|
| `GET /health` | API process health response |
| `POST /auth/register` | Register with name, email, and password |
| `POST /auth/login` | Sign in and receive a JWT |
| `POST /auth/google` | Sign in using a verified Google credential |
| `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id` | User record operations |
| `GET /recommendations`, `POST /recommendations`, `GET /recommendations/:id`, `PUT /recommendations/:id`, `DELETE /recommendations/:id` | Recommendation operations |
| `GET /uploads`, `POST /uploads`, `DELETE /uploads/:id` | Authenticated resource management |
| `POST /api/ai/recommend`, `POST /api/ai/autocomplete` | Authenticated AI suggestion requests |

Send a valid JWT in the `Authorization: Bearer <token>` header for recommendation, upload-management, and AI routes. The generic `/users` routes are currently not protected by authentication; do not expose them publicly with real user data. Recommendation routes also do not yet enforce record ownership.

## Deployment Links

- **Frontend:** [https://jagasree-personalized-recommendation.onrender.com](https://jagasree-personalized-recommendation.onrender.com/)
- **Backend:** [https://jagasree-capstone-personalized.onrender.com](https://jagasree-capstone-personalized.onrender.com/)
- **Backend health route:** [https://jagasree-capstone-personalized.onrender.com/health](https://jagasree-capstone-personalized.onrender.com/health)

The Render backend blueprint is configured in [`render.yaml`](render.yaml). Production environment values, including MongoDB and JWT credentials and (if used) the OpenAI key, must be set in Render's environment settings rather than committed to the repository.

## Folder Structure

```text
client/
  public/                 Static assets
  src/
    components/           Login, registration, upload, and recommendation UI
    utils/                Recommendation formatting helpers and tests
    App.jsx               Main page and recommendation feed
    api.js                Frontend API base URL
server/
  Middleware/             JWT authentication middleware
  models/                 User, recommendation, and upload metadata schemas
  uploads/                Uploaded resource files
  server.js               Express routes and service configuration
docs/
  bruno/                  Bruno API collection and local environment
  final-submission/       Walkthrough, defense questions, and PR draft
render.yaml               Render backend service configuration
```

Important source files include [`client/src/components/AIRecommendations.jsx`](client/src/components/AIRecommendations.jsx), [`client/src/components/ResourceUpload.jsx`](client/src/components/ResourceUpload.jsx), [`server/models/User.js`](server/models/User.js), [`server/models/Recommendation.js`](server/models/Recommendation.js), and [`server/models/UploadedResource.js`](server/models/UploadedResource.js).

## Future Improvements

- Add authenticated user-profile editing and interest management.
- Rank recommendations using a user's stored interests and activity.
- Save AI-generated recommendations when a user chooses to keep them.
- Restrict user and recommendation operations to authorized owners or administrators; avoid exposing user documents through public routes.
- Add backend tests, stronger request validation, and rate limiting.
- Use persistent object storage for uploaded files in deployments where the server filesystem is ephemeral.

## Contributors

- Jagasree S

# Personalized Recommendation System

## Project Overview

Personalized Recommendation System is a full-stack learning-resource application. Signed-in users can manage uploaded learning resources, browse and manage recommendation records, and request AI-generated suggestions for a topic they choose. The client is built with React and Vite; the API uses Node.js, Express, and MongoDB through Mongoose.

The current AI workflow uses the topic entered in the form. It does not rank results using saved user interests or activity. AI-generated suggestions are shown in the current client session and are not saved as recommendation records.

## Problem Statement

Learners may have difficulty finding useful learning materials among broad, generic suggestions. A lightweight place to organize resources and request topic-focused ideas can make it easier to explore a subject.

## Proposed Solution

The application combines authenticated accounts, a personal resource-upload area, a recommendation feed, and an AI suggestion workflow. Users can enter a topic, receive topic autocomplete suggestions, and request a set of related learning ideas through a backend integration with OpenAI.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, JavaScript, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB; Mongoose schemas and models. The connection supports MongoDB Atlas through `MONGO_URI`. |
| Authentication | bcryptjs password hashing, JSON Web Tokens (JWT), Google Identity Services / Google ID token verification (optional configuration) |
| AI integration | OpenAI Chat Completions API |
| File handling | Multer; files stored on the API server's filesystem |
| Hosting configuration | Render |
| API examples | Bruno collection in `docs/bruno/` |
| Frontend checks | Jest utility tests, ESLint, Vite production build |

## Key Features

- Register and log in using email and password.
- Optional Google sign-in when both client and server Google client IDs are configured.
- Store and retrieve recommendation records; signed-in users can edit and delete records in the feed.
- Request up to four AI-generated recommendations for a topic.
- Get AI topic autocomplete suggestions while entering a topic.
- Upload, list, open, and delete resources associated with the signed-in user. Supported uploads are PDF, DOC, DOCX, PNG, and JPEG, with a 5 MB size limit.
- Store user interests in the user schema. There is not currently a profile editor or automatic interest-based ranking.

## System Architecture

```text
Browser (React + Vite)
  |  HTTPS/JSON; JWT sent for protected requests
  v
Express API (Node.js)
  |-- Mongoose --------------------> MongoDB / MongoDB Atlas
  |-- Google Auth Library --------> Google ID-token verification (optional)
  |-- OpenAI Chat Completions ----> topic suggestions and autocomplete
  |-- Multer ---------------------> API server filesystem + MongoDB metadata
  +-- bcryptjs / jsonwebtoken ----> password hashing and API authentication
```

The frontend API origin is read from `VITE_API_URL`. The checked-in production client environment points to the Render API. The API's CORS allow-origin value comes from `CLIENT_URL` (and falls back to permissive origin handling when unset). MongoDB is configured through `MONGO_URI`; the server code has a local MongoDB fallback if that variable is absent.

The health endpoint responds with `{"status":"ok"}` without checking the database or external integrations. Upload binaries are stored on local server disk, not a configured object-storage service.

## How the Application Works

1. A user registers with a name, email, and password. The API hashes the password before storing the user.
2. The user logs in; the API returns a one-hour JWT. The browser stores the token in local storage and sends it as a bearer token on protected API requests.
3. Signed-in users can upload a resource. The API stores the file on disk and saves its metadata with a reference to the user in MongoDB.
4. The client loads the authenticated recommendation feed. It can display recommendation records and provide edit/delete actions.
5. To request AI suggestions, a user enters a topic. The client can request autocomplete and submit the topic to the API; the API calls OpenAI and returns suggestions to the client. These AI results are not persisted.

The upload list is scoped to the signed-in user; it is not a shared public resource feed. The recommendation API's list operation returns recommendation records across users, and recommendation updates/deletes are not restricted to the record owner.

## Database Structure

Mongoose models use the default pluralized MongoDB collection names: `users`, `recommendations`, and `uploadedresources`.

| Collection | Main fields | Relationships |
|---|---|---|
| `users` | `name`, unique `email`, hashed `password`, optional `googleId`, `interests`, timestamps | `recommendations` is an array of references to recommendation records |
| `recommendations` | `title`, `description`, `category`, `tags` | `user` references the user who created the record |
| `uploadedresources` | `title`, `description`, `originalName`, `storedName`, `mimeType`, `size`, timestamps | `user` references the owner; file bytes live on server disk |

See [Database Documentation](docs/DATABASE_DOCUMENTATION.md) for field and relationship details.

## API Endpoints

The API is served from the backend origin. Protected endpoints require `Authorization: Bearer <JWT>`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | API process health response |
| `POST` | `/auth/register` | Public | Register an email/password account |
| `POST` | `/auth/login` | Public | Verify credentials and return a JWT |
| `POST` | `/auth/google` | Public; server configuration required | Verify a Google credential and sign in |
| `GET` | `/users` | Public in current implementation | List users and populated recommendations |
| `GET` | `/users/:id` | Public in current implementation | Get a user and populated recommendations |
| `POST` | `/users` | Public in current implementation | Attempts to create a user; currently fails model validation because the handler omits the required password |
| `PUT` | `/users/:id` | Public in current implementation | Update a user record |
| `GET` | `/recommendations` | JWT required | List recommendation records and populate their user |
| `POST` | `/recommendations` | JWT required | Create a recommendation record |
| `GET` | `/recommendations/:id` | JWT required | Get one recommendation and populate its user |
| `PUT` | `/recommendations/:id` | JWT required | Update a recommendation |
| `DELETE` | `/recommendations/:id` | JWT required | Delete a recommendation |
| `GET` | `/uploads` | JWT required | List the signed-in user's uploaded resources |
| `POST` | `/uploads` | JWT required | Upload a resource using multipart form data |
| `DELETE` | `/uploads/:id` | JWT required | Delete one of the signed-in user's resources |
| `POST` | `/api/ai/autocomplete` | JWT required; OpenAI key required | Return topic autocomplete suggestions |
| `POST` | `/api/ai/recommend` | JWT required; OpenAI key required | Return topic-based AI recommendations |
| `GET` | `/uploads/:storedName` | Public static-file serving | Serve a file from the uploads directory |

The generic `/users` routes are not protected and can expose user documents; recommendation mutations also lack owner checks. These are current implementation limitations, not recommended production access controls. Full request details and response behavior are in [API Documentation](docs/API_DOCUMENTATION.md).

## Live Deployment Links

- **Frontend:** [https://jagasree-personalized-recommendation.onrender.com](https://jagasree-personalized-recommendation.onrender.com/)
- **Backend:** [https://jagasree-capstone-personalized.onrender.com](https://jagasree-capstone-personalized.onrender.com/)
- **Backend health endpoint:** [https://jagasree-capstone-personalized.onrender.com/health](https://jagasree-capstone-personalized.onrender.com/health)
- **GitHub repository:** [jagasree111/Jagasree_Capstone_Personalized_Recommendation_System](https://github.com/jagasree111/Jagasree_Capstone_Personalized_Recommendation_System)

**Deployment check (2026-10-30):** The frontend returned HTTP 200 and rendered its home page. The backend `/health` endpoint returned HTTP 200 with `{"status":"ok"}`. This does not verify database connectivity or the OpenAI/Google integrations. The actual Render environment values are not accessible from this repository, so the configured MongoDB Atlas URI, secrets, and optional integration credentials cannot be confirmed here.

The backend Render blueprint is in `render.yaml`. The frontend API base URL is set in `client/.env.production`. The Render blueprint lists `MONGO_URI`, `JWT_SECRET`, and `OPENAI_API_KEY` as externally supplied values, sets `OPENAI_MODEL`, and sets `CLIENT_URL`; it does not declare the optional Google client ID.

## Project Folder Structure

```text
.
├── client/
│   ├── public/                 Static assets
│   └── src/
│       ├── components/         Login, registration, upload, recommendation UI
│       ├── utils/              Recommendation formatting helper and Jest test
│       ├── App.jsx             Main page and recommendation feed
│       └── api.js              Frontend API base URL and auth requests
├── server/
│   ├── Middleware/             JWT authentication middleware
│   ├── models/                 User, recommendation, resource metadata schemas
│   ├── uploads/                Uploaded resource files (runtime storage)
│   ├── server.js               Express setup and API routes
│   └── Dockerfile              Backend container configuration
├── docs/
│   ├── bruno/                  Bruno API request collection
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_DOCUMENTATION.md
│   └── API_DOCUMENTATION.md
├── render.yaml                 Render backend service configuration
├── WALKTHROUGH_SCRIPT.md
├── TECHNICAL_DEFENSE.md
└── FINAL_SUBMISSION_CHECKLIST.md
```

## Prerequisites

- Node.js 22 (the backend Dockerfile uses `node:22-alpine`) and npm.
- MongoDB, either a local instance or a MongoDB Atlas database URI.
- An OpenAI API key to use the AI autocomplete and recommendation routes.
- Google OAuth web client IDs only if Google sign-in is to be enabled.
- Git to clone the repository.

## Installation Instructions

```bash
git clone https://github.com/jagasree111/Jagasree_Capstone_Personalized_Recommendation_System.git
cd Jagasree_Capstone_Personalized_Recommendation_System
```

Create local environment files from the checked-in templates.

**PowerShell:**

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

**Bash:**

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit the new files with your local MongoDB URI, a unique JWT secret, and any optional integration settings. Do not commit the `.env` files.

Install dependencies:

```bash
npm --prefix server install
npm --prefix client install
```

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URI` | Recommended | MongoDB connection string. Atlas deployments should use the Atlas-provided URI. If omitted, the code falls back to a local MongoDB URI. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs. The server exits if it is missing. |
| `CLIENT_URL` | Recommended | Frontend origin allowed by CORS. The server falls back to permissive origin handling if omitted. |
| `OPENAI_API_KEY` | For AI routes | Backend-only key for OpenAI requests. |
| `OPENAI_MODEL` | No | OpenAI model name; defaults to `gpt-4o-mini`. |
| `GOOGLE_CLIENT_ID` | Optional | Google web client ID used by server-side token verification. |
| `PORT` | No | HTTP port; defaults to `5000`. |

### Frontend (`client/.env`)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend origin. Local fallback in code is `http://localhost:5000`. |
| `VITE_GOOGLE_CLIENT_ID` | Optional public Google web client ID used by Google Identity Services. |

The checked-in `client/.env.production` sets `VITE_API_URL` to the supplied Render backend. Any `VITE_` variable is included in client-side code; never place private credentials there. Configure backend credentials in the hosting provider's secret environment settings.

## How to Run the Project

Start the backend in one terminal:

```bash
npm --prefix server start
```

Start the frontend in another terminal:

```bash
npm --prefix client run dev
```

Vite normally serves the client at `http://localhost:5173`; the API defaults to `http://localhost:5000`. Check the local API process with:

```bash
curl http://localhost:5000/health
```

The expected process-health response is `{"status":"ok"}`. It does not confirm MongoDB connectivity. The Bruno collection under `docs/bruno/personalized-recommendation-api/` contains request examples. Available client quality commands are `npm --prefix client test`, `npm --prefix client run lint`, and `npm --prefix client run build`.

## Screenshots

No application screenshots are currently committed in the repository. Add genuine captures of the deployed or locally running application here before final submission; suggested views are the landing page, registration/login, resource upload, and AI recommendation results. Do not use mock or placeholder screenshots as proof of deployment.

## Future Enhancements

- Add authenticated user-profile editing and interest management.
- Rank recommendations using a user's stored interests and activity.
- Let a user save AI-generated suggestions as recommendation records.
- Protect user routes and enforce ownership/authorization on recommendation operations.
- Add backend tests, stronger request validation, and rate limiting.
- Store uploads in persistent object storage for deployments where the server filesystem is ephemeral.

## Author Information

- **Author:** Jagasree S
- **GitHub:** [jagasree111](https://github.com/jagasree111)
- **Project repository:** [Jagasree_Capstone_Personalized_Recommendation_System](https://github.com/jagasree111/Jagasree_Capstone_Personalized_Recommendation_System)

# Final Project Submission & Technical Documentation

## Problem solved

This project helps learners discover learning materials and topic-based suggestions in a single web application. AI suggestions are based on a topic entered by the user; automatic ranking from stored user interests is not implemented.

## Architecture overview

The React/Vite client communicates with a Node.js/Express API. MongoDB stores user, recommendation, and uploaded-resource metadata records through Mongoose. The backend handles password hashing, JWT verification, Google credential verification when configured, file uploads, and server-side OpenAI requests.

## Major technologies

React, Vite, Node.js, Express, MongoDB, Mongoose, bcryptjs, JWT, Google Identity Services, Multer, OpenAI Chat Completions API, Render, Bruno, and Jest.

## Implemented features

- Email/password registration and login, plus optional Google sign-in.
- Recommendation API operations and a frontend feed with editing/deletion.
- Authenticated resource listing, upload, and deletion with a 5 MB limit and MIME type allowlist.
- Authenticated AI topic autocomplete and topic-based recommendation suggestions.

## Key implementation decisions

- The OpenAI API key is used by the backend and is not placed in the browser bundle.
- The frontend API origin is configurable; production is pointed at the deployed backend.
- JWT protects recommendation, AI, and upload-management routes.
- User interests exist in the schema, but interest editing and recommendation ranking based on history remain future work.

## Challenges and improvements

Preparation focused on checking documentation against actual routes and distinguishing the lightweight health response from complete application health. The README and walkthrough now describe the current behavior and limitations explicitly. Personal development challenges must be supplied by the author; they are not inferred from repository contents.

## Known limitations

- Generic `/users` routes are not authenticated.
- Recommendation routes do not enforce per-record ownership.
- AI results are not persisted.
- Uploaded files use the server filesystem, which may be ephemeral in deployment.
- The backend package has no test script.

## Deployment links

- Frontend: https://jagasree-personalized-recommendation.onrender.com/
- Backend: https://jagasree-capstone-personalized.onrender.com/
- Health: https://jagasree-capstone-personalized.onrender.com/health

## README and configuration changes

- Expanded the root README with setup, environment variables, API routes, architecture, folder structure, deployments, limitations, and future improvements.
- Added a production Vite API URL pointing to the deployed backend.
- Updated the client ignore rules to track this non-secret production setting.
- Corrected the Render backend CORS origin to the deployed frontend.
- Added an 8-minute walkthrough and technical-defense guide.

## Tests performed

- `npm --prefix client test`: passed; 1 suite and 6 tests.
- `npm --prefix client run lint`: passed.
- `npm --prefix client run build`: passed; Vite production bundle generated.
- `node --check server/server.js` and `node --check server/Middleware/authMiddleware.js`: passed.
- Deployed frontend: HTTP 200.
- Backend `/health`: HTTP 200 with `{"status":"ok"}`. This does not verify database connectivity or other workflows.

## Review checklist

- [ ] Source: `feature/final-project-submission`
- [ ] Target: `main`
- [ ] Leave this PR open and do not merge it.

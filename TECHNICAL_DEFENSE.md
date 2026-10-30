# Technical Defense Preparation

The answers below describe the current code. In particular, AI suggestions are not saved, user interests are not used for automatic ranking, and some API authorization limitations remain.

## Architecture and Frontend

### 1. What does the project do?
It lets signed-in users manage uploaded learning resources, view recommendation records, and request topic-based AI suggestions.

### 2. What is the overall architecture?
It is a client-server application. A React/Vite browser client sends HTTP requests to a Node.js/Express API. The API uses Mongoose to store data in MongoDB and calls OpenAI or Google verification services when configured.

### 3. Why separate the frontend and backend?
The frontend handles the user interface; the backend owns API behavior, database access, password handling, token verification, file processing, and private provider credentials.

### 4. What is React used for?
React builds the component-based interface, including login, registration, uploads, AI suggestions, and recommendation cards.

### 5. What does Vite do?
Vite provides the frontend development server and builds the React client for production.

### 6. How is state handled?
The current screens use React component state and local storage. For example, forms keep their input and result state locally, while the login token and user details are stored in browser local storage.

### 7. How does the frontend know where the API is?
It reads `VITE_API_URL` in `client/src/api.js`. The production environment file points to the deployed Render API; the local fallback is `http://localhost:5000`.

### 8. Is there a separate page router?
The current app switches among the home, login, and registration views using a `page` state in `App.jsx`; it does not use a dedicated routing library.

## Backend and APIs

### 9. What is Node.js used for?
Node.js runs the JavaScript backend server and the Express API.

### 10. What is Express used for?
Express configures middleware and HTTP routes for authentication, users, recommendations, uploads, AI calls, health checking, and static upload access.

### 11. What is a REST API?
A REST-style API exposes resources and actions through HTTP methods and paths. This project uses methods such as GET, POST, PUT, and DELETE.

### 12. How does the frontend call the backend?
It uses `fetch` with the configured API origin. JSON requests use `Content-Type: application/json`; resource uploads use multipart form data.

### 13. What does the health endpoint check?
`GET /health` returns `{"status":"ok"}`. It confirms the API process responds; it does not verify MongoDB, OpenAI, or Google.

### 14. Where can I find API examples?
The Bruno collection in `docs/bruno/personalized-recommendation-api/` includes health, authentication, user, recommendation, and upload requests.

## Database

### 15. What is MongoDB Atlas?
MongoDB Atlas is the hosted MongoDB service. This backend can connect to Atlas using the `MONGO_URI` environment variable; the checked-in code alone cannot confirm which database URI is configured in Render.

### 16. Why use Mongoose?
Mongoose provides schemas, models, validation, and MongoDB querying for the three data types in this project.

### 17. What collections are used?
The models map by default to `users`, `recommendations`, and `uploadedresources`.

### 18. How are users and recommendations related?
The Recommendation model has a required `user` ObjectId reference. The User model also has an array of recommendation references. Selected routes populate the recommendation's user when reading data.

### 19. How are uploaded resources related to a user?
Each resource metadata document has a required `user` ObjectId reference. The upload listing and deletion queries use the authenticated user's ID.

### 20. Are uploaded files stored in MongoDB?
No. Multer stores the binary file on the server filesystem. MongoDB stores metadata such as title, filename, MIME type, size, and owner.

## Authentication and Security

### 21. How does password authentication work?
Registration hashes passwords with bcryptjs. Login compares the submitted password with the stored hash. Plain-text passwords are not intentionally stored.

### 22. What is a JWT?
A JSON Web Token is a signed token that carries claims used by the API to identify an authenticated user. The project issues tokens with a one-hour expiry.

### 23. How are protected routes secured?
The authentication middleware reads the bearer token from the Authorization header, verifies it using `JWT_SECRET`, and attaches decoded claims to the request.

### 24. Is Google authentication implemented?
Yes, optionally. The frontend uses Google Identity Services when `VITE_GOOGLE_CLIENT_ID` is set. The backend verifies the credential using `google-auth-library` and `GOOGLE_CLIENT_ID`. Both sides must be configured.

### 25. Where should private keys be stored?
Backend secrets such as `JWT_SECRET`, `MONGO_URI`, and `OPENAI_API_KEY` belong in server/hosting environment variables, not in frontend source or public `VITE_` variables.

### 26. What security limitations should be acknowledged?
The generic `/users` CRUD routes currently have no authentication middleware, and recommendation routes do not enforce record ownership. Static upload files are served without authentication. These should be addressed before using the system with sensitive real-world data.

### 27. What is CORS doing?
CORS controls which browser origins may access the API. The backend uses `CLIENT_URL`; if it is missing, the code falls back to permissive origin handling. Production should set the intended frontend origin explicitly.

## Recommendation and Integration Workflow

### 28. How does the recommendation feature work?
The user submits a topic. The backend sends it to the OpenAI Chat Completions API, validates and filters the returned structure, then sends up to four suggestions to the frontend.

### 29. How does autocomplete work?
The client waits briefly after a user types at least two characters and sends a protected request. The API asks OpenAI for topic completions and returns up to five unique suggestions.

### 30. Does the system personalize based on saved user interests?
Not currently. The User model has an `interests` array, but there is no profile editor or ranking workflow that uses it. AI recommendations use the topic entered in the form.

### 31. Are AI suggestions saved in MongoDB?
No. The API returns them to the client, which displays them in the current session. They are separate from persisted Recommendation documents.

### 32. What happens when the OpenAI key is missing?
The AI endpoints return a service-unavailable response. Account, resource, and recommendation API functionality is not inherently dependent on the AI key.

### 33. How does the upload workflow validate files?
Multer accepts configured PDF, Word, PNG, and JPEG MIME types and imposes a 5 MB file-size limit. The API also requires a non-empty title.

### 34. Are uploaded resources shared across users?
The resource list is scoped to the signed-in user. Files are statically served by path without authentication, but there is no public cross-user resource feed in the current UI.

## Deployment and Project Reflection

### 35. How is the backend deployed?
`render.yaml` defines a Render Node web service, its npm install/start commands, health-check path, and environment variables to supply or set.

### 36. How is the production API URL configured?
`client/.env.production` defines `VITE_API_URL` as the deployed API origin. A hosting build setting can override environment values.

### 37. Was the deployment checked?
During documentation preparation, the frontend returned HTTP 200 and rendered the home page. The backend health endpoint returned HTTP 200 with `{"status":"ok"}`. This does not confirm Atlas connectivity or optional integrations.

### 38. What deployment information still needs confirmation?
The actual Render environment variables are not available in the repository. Confirm that `MONGO_URI` points to the intended Atlas database, `JWT_SECRET` is set, and OpenAI/Google values are present if those features will be demonstrated.

### 39. What is a practical deployment limitation for file uploads?
Files are stored on the backend filesystem. If the hosting filesystem is ephemeral, files may not persist through restarts or redeployments; object storage would be a more reliable future option.

### 40. What is one improvement you would prioritize?
I would first strengthen authorization: protect user routes, remove sensitive fields from responses, and enforce ownership checks on recommendation operations. Then I would add backend tests and persistent object storage.

### 41. What technical design lesson does this project demonstrate?
External integrations and secrets belong on the server, data models should express relationships, and health checks should be clearly distinguished from full dependency checks.

### 42. What implementation challenge can be discussed accurately?
One important integration challenge is coordinating authenticated browser requests with server-side database and external-service calls. The code addresses this with a shared API origin, bearer-token middleware, and backend-only OpenAI requests. Do not claim a specific historical obstacle unless it reflects your own experience.

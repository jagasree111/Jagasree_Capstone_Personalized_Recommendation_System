# Personalized Recommendation System

## 1. Project Title

Personalized Recommendation System

## 2. Problem Statement

Online communities often recommend the same type of content to every user, even when each learner has different goals, interests, and knowledge levels. This creates a poor discovery experience and reduces engagement. Students and community members need recommendations that are relevant to their interests and learning path.

## 3. Proposed Solution

This project builds a full-stack recommendation platform that stores user interests, supports authentication, and suggests useful resources based on personal preferences. The system combines:

- a React frontend for the user experience,
- a Node.js + Express API for business logic,
- MongoDB for data storage,
- JWT-based login for protected actions,
- Google sign-in for convenience,
- OpenAI-powered AI autocomplete and recommendation generation for topic discovery.

## 4. Technology Stack

- Frontend: React.js, Vite, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas / Mongoose
- Authentication: JWT, Google Identity Services
- AI Integration: OpenAI Chat Completions API
- Deployment: Render
- API Documentation: Bruno
- Version Control: Git + GitHub

## 5. Key Features

- User registration and login using email/password
- Google login support
- User profile and interest support
- Recommendation CRUD operations
- AI-powered topic autocomplete while typing an interest
- AI-generated recommendations based on user input
- Secure file upload for learning resources (PDF/DOC/DOCX/PNG/JPG)
- Protected API endpoints using JWT authorization
- Responsive frontend for community use

## 6. Project Architecture

The project is divided into two main parts:

- `client/` contains the React frontend application.
- `server/` contains the Express API and MongoDB models.
- `docs/bruno/` contains Bruno API request collections for local testing.
- `render.yaml` configures the deployed services on Render.

Project structure:

```text
Jagasree_Capstone_Personalized_Recommendation_System/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── vite.config.js
├── server/
│   ├── models/
│   ├── Middleware/
│   ├── uploads/
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── docs/
│   └── bruno/
├── README.md
├── render.yaml
└── .gitignore
```

Main source files:

- `client/src/App.jsx` — main app shell and page flow
- `client/src/components/AIRecommendations.jsx` — AI autocomplete and recommendation UI
- `client/src/components/ResourceUpload.jsx` — resource upload and listing
- `client/src/api.js` — frontend API configuration
- `server/server.js` — Express routes, auth, uploads, MongoDB connection, and AI endpoints
- `server/models/User.js` — user schema
- `server/models/Recommendation.js` — recommendation schema
- `server/models/UploadedResource.js` — uploaded file metadata schema

## 7. Live Deployment Links

- Frontend: https://jagasree-personalized-recommendation.onrender.com/
- Backend: https://jagasree-capstone-personalized.onrender.com/
- Backend health endpoint: https://jagasree-capstone-personalized.onrender.com/health

The backend exposes a health check route at `/health`, and the project uses this route for deployment verification.

## 8. Installation and Setup Instructions

1. Clone the repository.

```bash
git clone https://github.com/jagasree111/Jagasree_Capstone_Personalized_Recommendation_System.git
cd Jagasree_Capstone_Personalized_Recommendation_System
```

2. Create environment files from the examples.

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Configure values in both `.env` files. See the environment section below.

4. Install dependencies for the server and client.

```bash
npm --prefix server install
npm --prefix client install
```

5. Start MongoDB locally or use your MongoDB Atlas connection string.

6. Start the backend:

```bash
npm --prefix server start
```

7. Start the frontend in another terminal:

```bash
npm --prefix client run dev
```

The frontend runs on the Vite default port `5173`, and the backend runs on port `5000` unless overridden by `PORT`.

## 9. Environment Variables

### Server environment (`server/.env`)

```env
MONGO_URI=mongodb://127.0.0.1:27017/personalized_recommendation_system
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
```

### Client environment (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

Notes:

- Do not commit real secrets or production credentials.
- `OPENAI_API_KEY` is required for the AI autocomplete and recommendation features.
- The frontend never stores the OpenAI key directly.
- `VITE_GOOGLE_CLIENT_ID` must match the Google client ID configured in the backend.

## 10. API Endpoints

The main API routes in `server/server.js` are listed below.

### Health and auth

- `GET /health` — health check
- `POST /auth/register` — register a new user
- `POST /auth/login` — login with email/password
- `POST /auth/google` — Google OAuth login

### User routes

- `GET /users` — list users
- `GET /users/:id` — get user by ID
- `POST /users` — create user
- `PUT /users/:id` — update user

### Resource upload routes

- `GET /uploads` — list uploaded resources for the authenticated user
- `POST /uploads` — upload a file
- `DELETE /uploads/:id` — delete an uploaded resource

### Recommendation routes

- `GET /recommendations` — list recommendations
- `POST /recommendations` — create a recommendation
- `GET /recommendations/:id` — get recommendation by ID
- `PUT /recommendations/:id` — update recommendation
- `DELETE /recommendations/:id` — delete recommendation

### AI endpoints

- `POST /api/ai/recommend` — generate AI suggestions from a topic or interest
- `POST /api/ai/autocomplete` — fetch topic suggestions while the user types

All recommendation and AI endpoints require a valid JWT in the `Authorization` header.

## 11. How to Run the Frontend and Backend

### Backend

```bash
cd server
npm install
npm start
```

Expected result:

- Server starts on `http://localhost:5000`
- MongoDB connection is attempted using `MONGO_URI`
- `/health` returns a JSON response like `{ "status": "ok" }`

### Frontend

```bash
cd client
npm install
npm run dev
```

Expected result:

- Vite starts the app on `http://localhost:5173`
- The browser connects to the backend URL configured in `VITE_API_URL`

## 12. Testing Instructions

Project validation checks available in this repository:

```bash
npm --prefix client run test
npm --prefix client run build
```

For backend server validation:

```bash
curl http://localhost:5000/health
```

The repository also includes a Bruno collection for API testing in `docs/bruno/`.

## 13. Screenshots

No screenshots are stored in the repository at the moment. When preparing the final submission and defense, the deployed frontend can be used to capture screenshots and short demo evidence for the main workflows.

## 14. Future Improvements

- Add profile editing with a dedicated interests dashboard
- Add recommendation filtering by category and tags
- Add more advanced recommendation logic based on user behavior and history
- Improve analytics and admin reporting
- Expand AI features with custom prompts and personalized ranking
- Add stronger validation and rate limiting for production deployment

## Author

Jagasree S

B.Tech Artificial Intelligence & Machine Learning

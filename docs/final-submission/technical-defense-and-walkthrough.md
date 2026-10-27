# Walkthrough Video and Technical Defense

This guide is based on the checked-in source and configuration. It does not claim that every deployed workflow has been tested. Before recording, verify login, uploads, and AI requests with a test account and working deployment configuration. Do not show credentials or real user data.

## 5-8 minute walkthrough script

### 0:00-0:45 — Introduction

**Screen actions:** Turn on the camera. Share the entire screen. Open the deployed frontend in a browser and keep the repository and README in separate tabs.

**Say:** “Hello, I’m Jagasree, and this is my Personalized Recommendation System. Learners can have difficulty finding useful resources from generic suggestions. My project provides a place to share learning resources and explore suggestions for a topic the learner chooses. It is built as a web application with a React frontend, an Express backend, and MongoDB.”

### 0:45-2:30 — Live application demo

**Screen actions:**

1. Show the deployed home page and briefly point out the navigation.
2. Sign in with a prepared test account, or register a test account if registration has been verified and you have enough time.
3. Show the authenticated resource list and the upload form. If the deployed upload flow is verified, upload a small non-sensitive sample document and show its entry. Delete the test upload afterward if appropriate.
4. Point out the recommendation feed. If test recommendations are present, open one, edit a safe field, save it, and then restore/delete only test data.
5. In the AI topic field, enter a topic and select an autocomplete suggestion if the OpenAI key and deployed workflow have been verified. Generate suggestions and explain that they are based on the entered topic.

**Say:** “A user can sign in, manage uploaded learning resources, and view recommendations. The AI form accepts a topic and can suggest related topics and recommendation ideas. These AI results are shown in the page; the current AI route does not save them as recommendation documents.”

If a workflow has not been verified or is unavailable, skip the action and say: “This workflow depends on deployment configuration, so I am showing the implemented interface/source rather than claiming a live success.”

### 2:30-3:30 — Technology stack

**Screen actions:** Switch to the README Technology Stack section, then return to the browser.

**Say:** “React builds the interactive page in the browser, and Vite runs and bundles it. Node and Express provide the API so database operations, authentication, and the OpenAI key stay on the server. MongoDB stores the application records. Separating the frontend and backend lets each part have a clear responsibility and communicate through HTTP requests.”

**Simple terms:** An API is a set of routes the frontend can call. A database stores information between visits. A server-side secret is kept on the backend rather than in browser code.

### 3:30-4:30 — Repository and README

**Screen actions:** Open the GitHub repository. Show `client/`, `server/`, `docs/`, `render.yaml`, and the root README. Scroll to setup, environment, running commands, and deployment links.

**Say:** “The client folder contains the React application. The server folder contains the Express API and Mongoose models. The docs folder includes Bruno requests for trying the API. The README explains how to set up the project without committing private keys.”

### 4:30-6:00 — Architecture and technical decisions

**Screen actions:** Open `client/src/api.js`, `client/src/components/AIRecommendations.jsx`, `server/server.js`, then the three model files.

**Say:** “The browser reads the API address from `VITE_API_URL`. For protected requests it sends a JWT in the Authorization header. The API checks that token before handling recommendation, upload-management, and AI routes. Passwords are hashed with bcryptjs. Google sign-in is optional and uses server-side verification. The OpenAI call is made by the backend, so the OpenAI key is not part of the frontend.”

“MongoDB has User, Recommendation, and UploadedResource models. User can store interests, recommendations store their text and tags, and uploaded-resource records store metadata. Actual uploaded files are placed in the server uploads directory. The current recommendation suggestions use the topic entered in the AI form, not an automatic ranking of a user's profile.”

### 6:00-7:00 — Challenges and lessons learned

**Screen actions:** Show the environment templates and the README limitations/future improvements section.

**Say:** “While preparing this defense, I checked which features are implemented in code and which are not connected to a complete workflow. For example, the user schema has an interests field, but the app does not currently edit interests or rank recommendations from them. I also confirmed that the health endpoint only reports that the API responds; it does not prove that the database or all features work. My lesson is to verify each workflow separately and keep deployment secrets on the server.”

**Personal input to add before recording:** Include one genuine development challenge you encountered, how you diagnosed it, and what you learned. This project history does not establish a personal development story, so do not present one as fact unless it is your experience.

### 7:00-8:00 — Conclusion

**Screen actions:** Return to the app or repository overview. Point to the future improvements in the README.

**Say:** “To summarize, this project combines a React client, an Express API, MongoDB, authentication, resource uploads, and topic-based AI suggestions. Future improvements include editing user interests, ranking recommendations from those interests, saving AI suggestions, adding backend tests, and improving ownership checks. Thank you for watching.”

## Recording and sharing checklist

- Turn on the camera and share the entire screen.
- Keep the application, GitHub repository, and README ready in separate tabs.
- Use a test account and test data; do not reveal credentials or private user information.
- Narrate clearly and demonstrate only workflows that you verified.
- Upload the recording to Google Drive.
- Set sharing to **Anyone with the link can view**.
- Open the actual share link in an incognito browser to verify access.
- Copy the actual video link into the Kalvium submission form. Do not invent a link or claim a recording exists before it does.

## Technical defense questions and simple answers

1. **What problem does the project address?**
   Generic suggestions may not match what a learner wants to study. This app lets a learner explore resources and request suggestions for a chosen topic.

2. **What does the application do?**
   It provides account sign-in, a recommendation feed, resource upload management, and optional AI-generated suggestions based on a topic.

3. **What are the main architectural parts?**
   React/Vite is the browser interface, Node/Express is the API, MongoDB stores records, and OpenAI is called by the backend for AI suggestions.

4. **What is a React component?**
   It is a reusable piece of the interface. For example, the login, upload, and recommendation-card components each render a part of the page.

5. **How is state used in React?**
   State stores values that can change while a user interacts with the page, such as the current topic, loading status, and recommendation results.

6. **What does `App.jsx` do?**
   It chooses which page section to show, loads the signed-in user's recommendation feed, and composes the main components.

7. **What is Node.js?**
   It lets JavaScript run outside the browser, including on the backend server.

8. **What does Express do?**
   Express maps HTTP requests to route handlers, such as login, health checks, and recommendation operations.

9. **What is an API route?**
   It is an address and HTTP method the frontend can use to request a specific operation from the backend.

10. **Which HTTP methods are used?**
    `GET` reads data, `POST` submits or creates data, `PUT` updates data, and `DELETE` removes data.

11. **What collections/models exist?**
    Mongoose models represent Users, Recommendations, and UploadedResources in MongoDB.

12. **What is in a User document?**
    It includes a name, unique email, password hash, optional Google ID, interests array, recommendation references, and timestamps.

13. **What is in a Recommendation document?**
    It stores a title, description, category, tags, and a reference to its user.

14. **What is stored for an uploaded resource?**
    MongoDB stores its title, description, original and stored filenames, MIME type, size, owner, and timestamps. The file contents live in `server/uploads/`.

15. **How does password login work?**
    Registration hashes the password with bcryptjs. Login compares the submitted password with the stored hash and returns a JWT after a successful match.

16. **What is a JWT?**
    A JSON Web Token is a signed token the client sends to prove it has authenticated. The backend verifies it before protected routes continue.

17. **How does Google login work?**
    The browser submits a Google credential to `/auth/google`; the backend verifies it with the configured Google client ID before issuing the app's JWT.

18. **How does the frontend find the backend?**
    It reads `VITE_API_URL` in `client/src/api.js`. The production environment file points to the deployed API, while local development defaults to port 5000.

19. **How does AI autocomplete work?**
    The frontend waits briefly after typing, then sends a topic query to the authenticated autocomplete route. The backend validates it and calls OpenAI.

20. **How are AI recommendations personalized?**
    They are based on the topic the user enters. The application does not currently rank them using stored interest history.

21. **Are AI results saved in MongoDB?**
    No. The AI endpoint returns the generated results to the frontend; it does not create Recommendation documents.

22. **Where does the OpenAI key go?**
    It belongs only in the backend `OPENAI_API_KEY` environment variable. It must not be put into a `VITE_` variable because those values are public in browser builds.

23. **What happens when AI is not configured?**
    The backend returns a configuration error response instead of claiming it generated suggestions.

24. **What protects file uploads?**
    Upload routes require a JWT, accept a limited set of MIME types, and enforce a 5 MB size limit. MIME type checks alone are not complete file-content security.

25. **What does the health endpoint prove?**
    It proves the API process can answer `/health`. It does not confirm MongoDB connectivity, authentication, AI, or upload workflows.

26. **What tests are available?**
    The frontend has Jest tests for recommendation tag formatting and update-payload creation, plus scripts for ESLint and a Vite build. There is no backend test script in the server package.

27. **What is a known security limitation?**
    The generic `/users` routes currently do not use authentication, and recommendation routes do not enforce ownership of each record. These should be restricted before exposing real user data broadly.

28. **What deployment limitation should be considered for uploads?**
    Files are stored on the server filesystem. A deployment with an ephemeral filesystem may lose them during redeployment or restart, so persistent object storage is a future improvement.

29. **What did you verify about the live deployment?**
    The frontend returned HTTP 200 and the backend `/health` endpoint returned HTTP 200 with `{"status":"ok"}` when checked. That does not prove the database or all user workflows work.

30. **What would you improve next?**
    Add an interest editor, rank and save recommendations, test backend workflows, strengthen ownership checks, and use persistent storage for uploaded files.

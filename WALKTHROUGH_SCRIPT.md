# Walkthrough Video Script

**Target length:** 3–5 minutes
**Suggested demo:** Use the live frontend and a test account. Avoid displaying real passwords, tokens, API keys, or personal data.

## 1. Introduction (about 20 seconds)

“Hello, my name is Jagasree. This is my Personalized Recommendation System. It is a web application built to help learners organize learning resources and explore suggestions related to a topic they choose.”

## 2. Problem Statement (about 20 seconds)

“Learners often have to search through many general resources before finding something useful for the topic they are studying. This project brings resource management and topic-based suggestions into one simple application.”

## 3. Proposed Solution (about 20 seconds)

“The application has a React frontend and a Node.js and Express backend. MongoDB stores account and resource information. A signed-in user can upload learning materials and ask the AI integration for ideas based on a topic.”

## 4. Live Application Overview (about 25 seconds)

“This is the home page. From here, a visitor can register or sign in. The application is deployed on Render. The backend has a health endpoint, but that endpoint only confirms that the API process is responding.”

## 5. Registration and Login (about 35 seconds)

“I’ll open the registration form and enter a test name, email, and password. The backend hashes the password before storing the account. After registration, I can sign in. The API returns a time-limited JWT, which the frontend sends with protected requests. Google sign-in is also implemented, but it only works when both Google client IDs are configured.”

## 6. Resource Upload (about 35 seconds)

“After signing in, I can add a title and description and choose a PDF, DOC, DOCX, PNG, or JPEG file. The upload limit is five megabytes. The backend stores the file and saves its metadata in MongoDB. This list is scoped to my account; it is not a public community feed. I can open or delete my uploaded resource.”

## 7. Recommendation Workflow (about 45 seconds)

“In the AI recommendations area, I can type a subject such as ‘machine learning.’ The application can request topic suggestions while I type. Then I submit the topic, and the backend calls OpenAI and returns recommendations with a title, description, category, tags, and reason. These AI results are shown in the page and are not automatically saved to the database.”

## 8. Main Features Demonstration (about 35 seconds)

“The page can also display stored recommendation records. The recommendation API supports creating, reading, updating, and deleting records, and the cards allow editing and deleting existing results. The AI-generated suggestions and stored recommendation records are separate parts of the current implementation.”

## 9. How the Application Addresses the Problem (about 25 seconds)

“The project gives a learner one place to manage personal learning files and get topic-focused ideas. Authentication protects resource-management and AI requests, while MongoDB keeps user and resource metadata available to the backend.”

## 10. Conclusion (about 20 seconds)

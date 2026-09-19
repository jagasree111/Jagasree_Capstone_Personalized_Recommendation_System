# Personalized Recommendation System

## Live Submission

- **Deployed frontend:** [Personalized Recommendation System](https://personalized-recommendation-client.onrender.com)
- **Backend health check:** [API health](https://jagasree-capstone-personalized.onrender.com/health)
- **GitHub pull request:** _Add the public PR URL after opening the pull request._
- **Video explanation:** _Add the public video URL after uploading the explanation._

The Render blueprint in [`render.yaml`](render.yaml) provisions both the Node/Express API and the Vite static frontend. The frontend uses `VITE_API_URL` so the same code works locally and in production.

## Run Locally

1. Start MongoDB locally.
2. In `server`, create `.env` with `MONGO_URI` and `JWT_SECRET`, then run `npm install` and `npm start`.
3. In `client`, run `npm install` and `npm run dev`.

The local frontend uses `http://localhost:5000` by default. To point it at another API, create `client/.env` with `VITE_API_URL=https://your-api.example.com`.

## 📌 Project Overview

Online communities often struggle to recommend relevant resources, discussions, events, and opportunities because user interests are not analyzed effectively. This project aims to build an AI-powered Personalized Recommendation System that understands user preferences and provides customized recommendations to improve user engagement and content discovery.

## 🎯 Problem Statement

Members of online communities receive the same recommendations regardless of their interests, making it difficult to discover relevant content. A personalized recommendation system can analyze user behavior and interests to deliver more accurate and meaningful suggestions.

## 🚀 Project Objectives

- Analyze user interests and preferences.
- Recommend relevant resources, discussions, and opportunities.
- Improve user engagement through personalized content.
- Provide a simple and user-friendly interface.

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### AI / ML
- Python
- Scikit-learn
- Pandas
- NumPy

### Tools
- Git
- GitHub
- VS Code
- Postman
- Figma

---

# 📅 Capstone Journey Plan

## Day 1
- Finalize project idea
- Create GitHub repository
- Setup README
- Create project structure

## Day 2
- Research recommendation algorithms
- Prepare requirement analysis
- Design database schema

## Day 3
- Create UI wireframes in Figma
- Design user flow

## Day 4
- Develop frontend pages using React
- Create reusable components

## Day 5
- Setup backend using Node.js and Express
- Configure PostgreSQL database

## Day 6
- Implement user authentication
- Create REST APIs

## Day 7
- Build recommendation logic
- Connect frontend with backend

## Day 8
- Test recommendation system
- Improve UI and responsiveness

## Day 9
- Fix bugs
- Optimize performance
- Add documentation

## Day 10
- Final testing
- Deploy project
- Prepare presentation and documentation

---

## 📂 Expected Features

- User Registration & Login
- User Profile Management
- Interest Selection
- Personalized Recommendations
- Search Resources
- Discussion Recommendations
- Opportunity Recommendations
- Responsive UI

---

## 🎯 Expected Outcome

A web application that recommends personalized resources, discussions, and opportunities based on each user's interests, improving the overall experience within online communities.

## API Documentation with Bruno

The API endpoints are documented in the Bruno collection at [`docs/bruno/personalized-recommendation-api`](docs/bruno/personalized-recommendation-api). Open the collection in Bruno, select the `local` environment, and follow the run order in [`docs/bruno/README.md`](docs/bruno/README.md).

The collection covers health, authentication, user CRUD, recommendation CRUD, and authenticated resource upload/delete endpoints.

---

## 👩‍💻 Author

**Jagasree S**

B.Tech Artificial Intelligence & Machine Learning

### Day 14
- Documentation and deployment

- ##project completed

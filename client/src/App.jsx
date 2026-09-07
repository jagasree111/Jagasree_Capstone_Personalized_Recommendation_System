import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RecommendationCard from "./components/RecommendationCard";
import Login from "./components/Login";
import Register from "./components/Register";
import ResourceUpload from "./components/ResourceUpload";

export const API_URL = "http://localhost:5000";

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [page, setPage] = useState("home");

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setRecommendations([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recommendations");
      }

      setRecommendations(data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    }
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      await fetchRecommendations();
    };

    loadRecommendations();
  }, []);

  return (
    <>
      <Navbar setPage={setPage} />

      <main className="container">
        {page === "login" && <Login />}

        {page === "register" && <Register />}

        {page === "home" && (
          <>
            <h1>Welcome to Personalized Recommendation System</h1>

            <p>
              Discover personalized recommendations tailored to your interests.
            </p>

            {localStorage.getItem("token") && <ResourceUpload />}

            <div className="cards">
              {recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation._id}
                  recommendation={recommendation}
                  onUpdate={fetchRecommendations}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;
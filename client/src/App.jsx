import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RecommendationCard from "./components/RecommendationCard";
import Login from "./components/Login";
import Register from "./components/Register";
import ResourceUpload from "./components/ResourceUpload";
import { API_URL } from "./api";

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
            <section className="hero-copy">
              <p className="eyebrow">Personal discovery workspace</p>
              <h1>Find resources that move your ideas forward.</h1>
              <p className="hero-description">
                Keep your community knowledge organized and surface recommendations
                that match the way you learn.
              </p>
            </section>

            {localStorage.getItem("token") ? (
              <ResourceUpload />
            ) : (
              <section className="welcome-panel">
                <div>
                  <p className="eyebrow">Start here</p>
                  <h2>Your recommendations are waiting.</h2>
                  <p>Sign in to view your feed, or create an account to share resources with your community.</p>
                </div>
                <div className="welcome-actions">
                  <button className="primary-button" type="button" onClick={() => setPage("register")}>Create account</button>
                  <button className="secondary-button" type="button" onClick={() => setPage("login")}>Sign in</button>
                </div>
              </section>
            )}

            {localStorage.getItem("token") && (
              <section className="recommendation-section">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Curated for you</p>
                    <h2>Latest recommendations</h2>
                  </div>
                  <span className="result-count">{recommendations.length} {recommendations.length === 1 ? "item" : "items"}</span>
                </div>
                <div className="cards">
                  {recommendations.length === 0 ? (
                    <p className="empty-state">Recommendations will appear here once your community adds them.</p>
                  ) : recommendations.map((recommendation) => (
                    <RecommendationCard key={recommendation._id} recommendation={recommendation} onUpdate={fetchRecommendations} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;
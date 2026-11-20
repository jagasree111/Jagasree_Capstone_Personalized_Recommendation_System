import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RecommendationCard from "./components/RecommendationCard";
import Login from "./components/Login";
import Register from "./components/Register";
import ResourceUpload from "./components/ResourceUpload";
import AIRecommendations from "./components/AIRecommendations";
import Profile from "./components/Profile";
import { API_URL, fetchWithBackendError } from "./api";

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [page, setPage] = useState("home");
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState("");
  const [isCreatingRecommendation, setIsCreatingRecommendation] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [newRecommendation, setNewRecommendation] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
  });

  const fetchRecommendations = useCallback(async () => {
    if (!token) {
      setRecommendations([]);
      return;
    }

    setIsLoadingRecommendations(true);
    setRecommendationError("");
    try {
      const response = await fetchWithBackendError(`${API_URL}/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        throw new Error("Your session has expired. Please sign in again.");
      }
      if (!response.ok) throw new Error(data.message || "Failed to fetch recommendations");
      if (!Array.isArray(data)) throw new Error("The API returned an unexpected recommendations response.");

      setRecommendations(data);
    } catch (error) {
      setRecommendationError(error.message || "Recommendations could not be loaded.");
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [token]);

  useEffect(() => {
    const loadRecommendations = async () => {
      await fetchRecommendations();
    };
    loadRecommendations();
  }, [fetchRecommendations]);

  const handleAuthenticated = useCallback(() => {
    setToken(localStorage.getItem("token"));
    try {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setRecommendations([]);
    setRecommendationError("");
    setCreateMessage("");
    setNewRecommendation({ title: "", description: "", category: "", tags: "" });
    setPage("home");
  };

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCreateRecommendation = async (event) => {
    event.preventDefault();
    setCreateMessage("");
    setIsCreatingRecommendation(true);
    try {
      const response = await fetchWithBackendError(`${API_URL}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newRecommendation,
          tags: newRecommendation.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Recommendation could not be created.");

      setNewRecommendation({ title: "", description: "", category: "", tags: "" });
      setCreateMessage("Your recommendation has been published.");
      await fetchRecommendations();
    } catch (error) {
      setCreateMessage(error.message || "Recommendation could not be created.");
    } finally {
      setIsCreatingRecommendation(false);
    }
  };

  const scrollToSection = useCallback((sectionId) => {
    if (page !== "home") {
      setPage("home");
      window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }), 0);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }, [page]);

  return (
    <div className="app-shell">
      <Navbar
        setPage={handlePageChange}
        isAuthenticated={Boolean(token)}
        user={user}
        onLogout={handleLogout}
        onNavigate={scrollToSection}
      />

      <main className="container">
        {page === "login" && (
          <Login setPage={handlePageChange} onAuthenticated={handleAuthenticated} />
        )}

        {page === "register" && <Register setPage={handlePageChange} />}

        {page === "profile" && token && (
          <Profile
            user={user}
            onProfileUpdated={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }}
          />
        )}

        {page === "home" && (
          <>
            <section className={`hero ${token ? "hero-authenticated" : ""}`}>
              <div className="hero-copy">
                <p className="eyebrow">{token ? "Your learning workspace" : "A smarter way to keep learning"}</p>
                <h1>{token ? `Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}.` : "Make your next learning move count."}</h1>
                <p className="hero-description">
                  {token
                    ? "Save the resources you love, share what works, and find a fresh path into your next big idea."
                    : "A calm, organized home for useful resources and ideas tailored to the topics you care about."}
                </p>
                <div className="hero-actions">
                  {token ? (
                    <>
                      <button className="primary-button" type="button" onClick={() => scrollToSection("discover")}>Explore a topic</button>
                      <button className="secondary-button" type="button" onClick={() => scrollToSection("library")}>Open your library</button>
                    </>
                  ) : (
                    <>
                      <button className="primary-button" type="button" onClick={() => handlePageChange("register")}>Create your free account <span aria-hidden="true">→</span></button>
                      <button className="text-button" type="button" onClick={() => handlePageChange("login")}>I already have an account</button>
                    </>
                  )}
                </div>
                <div className="hero-trust">
                  <span className="trust-mark" aria-hidden="true">✦</span>
                  <span>One place for your next great idea</span>
                </div>
              </div>
              <div className="hero-art" aria-label="A preview of your personalized learning workspace">
                <div className="art-orbit orbit-one" />
                <div className="art-orbit orbit-two" />
                <div className="art-note note-main">
                  <span className="note-icon note-icon-sun" aria-hidden="true">✳</span>
                  <span className="note-label">YOUR NEXT TOPIC</span>
                  <strong>Creative thinking</strong>
                  <span className="note-caption">A little inspiration goes a long way.</span>
                  <div className="note-progress"><span /></div>
                  <span className="note-progress-label">3 ideas to explore</span>
                </div>
                <div className="art-note note-float">
                  <span className="float-icon" aria-hidden="true">↗</span>
                  <span><strong>Keep the good stuff.</strong><br />Your resources, together.</span>
                </div>
                <span className="art-spark spark-one" aria-hidden="true">✳</span>
                <span className="art-spark spark-two" aria-hidden="true">✦</span>
              </div>
            </section>

            {!token && (
              <section className="feature-strip" aria-label="How the learning workspace helps">
                <article className="feature-item">
                  <span className="feature-number">01</span>
                  <h2>Discover</h2>
                  <p>Turn a passing interest into a clear next step with topic-based AI ideas.</p>
                </article>
                <article className="feature-item">
                  <span className="feature-number">02</span>
                  <h2>Collect</h2>
                  <p>Keep your favorite learning resources in one tidy, personal library.</p>
                </article>
                <article className="feature-item">
                  <span className="feature-number">03</span>
                  <h2>Share</h2>
                  <p>Pass along recommendations that help your learning community grow.</p>
                </article>
              </section>
            )}

            {token ? (
              <>
                <ResourceUpload />

                <section className="ai-section" id="discover">
                  <AIRecommendations />
                </section>

                <section className="recommendation-section" id="recommendations">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">From your community</p>
                      <h2>Recommendations</h2>
                    </div>
                    <span className="result-count">{recommendations.length} {recommendations.length === 1 ? "recommendation" : "recommendations"}</span>
                  </div>
                  <div className="recommendation-workspace">
                    <form className="create-recommendation-form" onSubmit={handleCreateRecommendation}>
                      <p className="form-kicker">Have something worth sharing?</p>
                      <h3>Add a recommendation</h3>
                      <label>
                        Title
                        <input
                          maxLength={120}
                          onChange={(event) => setNewRecommendation({ ...newRecommendation, title: event.target.value })}
                          placeholder="A resource or idea to explore"
                          required
                          value={newRecommendation.title}
                        />
                      </label>
                      <label>
                        What makes it useful?
                        <textarea
                          maxLength={1000}
                          onChange={(event) => setNewRecommendation({ ...newRecommendation, description: event.target.value })}
                          placeholder="Share a little context for the community"
                          required
                          rows="3"
                          value={newRecommendation.description}
                        />
                      </label>
                      <label>
                        Topic
                        <input
                          maxLength={80}
                          onChange={(event) => setNewRecommendation({ ...newRecommendation, category: event.target.value })}
                          placeholder="e.g. Design"
                          required
                          value={newRecommendation.category}
                        />
                      </label>
                      <label>
                        Tags <span className="optional-label">Optional · separate with commas</span>
                        <input
                          maxLength={200}
                          onChange={(event) => setNewRecommendation({ ...newRecommendation, tags: event.target.value })}
                          placeholder="creativity, beginner-friendly"
                          value={newRecommendation.tags}
                        />
                      </label>
                      <button className="primary-button" disabled={isCreatingRecommendation} type="submit">
                        {isCreatingRecommendation ? "Publishing..." : "Publish recommendation"}
                      </button>
                      {createMessage && <p className="form-message" role="status">{createMessage}</p>}
                    </form>

                    <div className="recommendation-feed">
                      {isLoadingRecommendations ? (
                        <p className="empty-state" role="status">Loading your recommendations...</p>
                      ) : recommendationError ? (
                        <div className="error-state" role="alert">
                          <p>{recommendationError}</p>
                          <button className="secondary-button" onClick={fetchRecommendations} type="button">Try again</button>
                        </div>
                      ) : recommendations.length === 0 ? (
                        <div className="empty-state empty-state-rich">
                          <span className="empty-icon" aria-hidden="true">✳</span>
                          <h3>Your community board is ready.</h3>
                          <p>Be the first to share a resource or idea that helped you learn.</p>
                        </div>
                      ) : (
                        <div className="cards">
                          {recommendations.map((recommendation) => (
                            <RecommendationCard
                              key={recommendation._id}
                              recommendation={recommendation}
                              canManage={Boolean(user?.id || user?._id) &&
                                (recommendation.user?._id || recommendation.user) === (user?.id || user?._id)}
                              onUpdate={fetchRecommendations}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <section className="closing-cta">
                <div>
                  <p className="eyebrow">A better place to begin</p>
                  <h2>Curiosity looks good on you.</h2>
                  <p>Build your own little corner of the internet for learning.</p>
                </div>
                <button className="primary-button" type="button" onClick={() => handlePageChange("register")}>Get started <span aria-hidden="true">→</span></button>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;

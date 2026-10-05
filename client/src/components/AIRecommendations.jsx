import { useState } from "react";
import { API_URL } from "../api";

function AIRecommendations() {
  const [interest, setInterest] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setRecommendations([]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ interest: interest.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate recommendations");
      }

      setRecommendations(data.recommendations || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="ai-recommendation-section" aria-labelledby="ai-recommendations-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Explore a new direction</p>
          <h2 id="ai-recommendations-title">AI-Powered Recommendations</h2>
        </div>
      </div>

      <form className="ai-recommendation-form" onSubmit={handleSubmit}>
        <label htmlFor="recommendation-interest">
          Interest or topic
          <input
            id="recommendation-interest"
            maxLength={200}
            onChange={(event) => setInterest(event.target.value)}
            placeholder="For example, Artificial Intelligence"
            required
            value={interest}
          />
        </label>
        <button className="primary-button" disabled={isLoading || !interest.trim()} type="submit">
          {isLoading ? "Generating..." : "Generate AI Recommendations"}
        </button>
      </form>

      {error && <p className="form-message" role="alert">{error}</p>}
      {isLoading && <p className="empty-state" role="status">Finding relevant ideas for your interest...</p>}

      {recommendations.length > 0 && (
        <div className="cards" aria-live="polite">
          {recommendations.map((recommendation, index) => (
            <article className="recommendation-card ai-recommendation-card" key={`${recommendation.title}-${index}`}>
              <h3>{recommendation.title}</h3>
              <p>{recommendation.description}</p>
              <p><strong>Category:</strong> {recommendation.category}</p>
              <p><strong>Tags:</strong> {(recommendation.tags || []).join(", ") || "None"}</p>
              <p className="recommendation-reason"><strong>Why it is recommended:</strong> {recommendation.whyRecommended}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AIRecommendations;

import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

function AIRecommendations() {
  const [interest, setInterest] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [error, setError] = useState("");
  const [suggestionError, setSuggestionError] = useState("");
  const skipAutocompleteRef = useRef(false);

  useEffect(() => {
    if (skipAutocompleteRef.current) {
      skipAutocompleteRef.current = false;
      return undefined;
    }

    const query = interest.trim();
    if (query.length < 2) return undefined;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingSuggestions(true);
      setSuggestionError("");

      try {
        const response = await fetch(`${API_URL}/api/ai/autocomplete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `******"token")}`,
          },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load AI suggestions");
        }

        if (!controller.signal.aborted) {
          const nextSuggestions = Array.isArray(data.suggestions)
            ? data.suggestions.filter((suggestion) => typeof suggestion === "string")
            : [];
          setSuggestions(nextSuggestions);
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setSuggestions([]);
          setSuggestionError(requestError.message || "Unable to load AI suggestions. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoadingSuggestions(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [interest]);

  const handleInterestChange = (event) => {
    const nextInterest = event.target.value;
    setInterest(nextInterest);
    setIsAutocompleteOpen(nextInterest.trim().length >= 2);
    setSuggestions([]);
    setSuggestionError("");
    setIsLoadingSuggestions(nextInterest.trim().length >= 2);
  };

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion !== interest) skipAutocompleteRef.current = true;
    setInterest(suggestion);
    setIsAutocompleteOpen(false);
    setSuggestions([]);
    setSuggestionError("");
    setIsLoadingSuggestions(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsAutocompleteOpen(false);
    setSuggestions([]);
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
        <div className="interest-autocomplete">
          <label htmlFor="recommendation-interest">Interest or topic</label>
          <input
            id="recommendation-interest"
            aria-autocomplete="list"
            aria-controls="interest-suggestions"
            aria-expanded={isAutocompleteOpen && interest.trim().length >= 2}
            autoComplete="off"
            maxLength={200}
            onChange={handleInterestChange}
            placeholder="For example, Artificial Intelligence"
            required
            role="combobox"
            value={interest}
          />
          {isAutocompleteOpen && interest.trim().length >= 2 && (
            <div className="autocomplete-suggestions" id="interest-suggestions" role="listbox" aria-label="AI-generated topic suggestions">
              {isLoadingSuggestions ? (
                <p className="autocomplete-status" role="status">Generating AI suggestions...</p>
              ) : suggestionError ? (
                <p className="autocomplete-error" role="alert">{suggestionError}</p>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <button
                    className="autocomplete-option"
                    key={`${suggestion}-${index}`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    role="option"
                    type="button"
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                <p className="autocomplete-status" role="status">No AI suggestions found. Try a different topic.</p>
              )}
            </div>
          )}
        </div>
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

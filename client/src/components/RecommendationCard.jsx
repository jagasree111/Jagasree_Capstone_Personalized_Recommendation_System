import { useState } from "react";
import { API_URL, fetchWithBackendError } from "../api";
import { createRecommendationUpdate, formatTags } from "../utils/recommendationUtils";

function RecommendationCard({ recommendation, canManage, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState(recommendation.title);
  const [description, setDescription] = useState(recommendation.description);
  const [category, setCategory] = useState(recommendation.category);
  const [tags, setTags] = useState(formatTags(recommendation.tags));

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      const response = await fetchWithBackendError(`${API_URL}/recommendations/${recommendation._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `******"token")}`,
        },
        body: JSON.stringify(createRecommendationUpdate({ title, description, category, tags })),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Recommendation update failed.");

      setIsEditing(false);
      await onUpdate();
    } catch (error) {
      setMessage(error.message || "Recommendation could not be updated.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(recommendation.title);
    setDescription(recommendation.description);
    setCategory(recommendation.category);
    setTags(formatTags(recommendation.tags));
    setMessage("");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this recommendation? This cannot be undone.")) return;

    setIsDeleting(true);
    setMessage("");
    try {
      const response = await fetchWithBackendError(`${API_URL}/recommendations/${recommendation._id}`, {
        method: "DELETE",
        headers: { Authorization: `******"token")}` },
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Recommendation delete failed.");

      await onUpdate();
    } catch (error) {
      setMessage(error.message || "Recommendation could not be deleted.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <article className="recommendation-card">
        <form onSubmit={handleUpdate}>
          <label>
            Title
            <input maxLength={120} onChange={(event) => setTitle(event.target.value)} required value={title} />
          </label>
          <label>
            Description
            <textarea maxLength={1000} onChange={(event) => setDescription(event.target.value)} required rows="3" value={description} />
          </label>
          <label>
            Topic
            <input maxLength={80} onChange={(event) => setCategory(event.target.value)} required value={category} />
          </label>
          <label>
            Tags
            <input maxLength={200} onChange={(event) => setTags(event.target.value)} value={tags} />
          </label>
          <div className="card-actions">
            <button disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save changes"}</button>
            <button disabled={isSaving} onClick={handleCancel} type="button">Cancel</button>
          </div>
        </form>
        {message && <p className="form-message" role="alert">{message}</p>}
      </article>
    );
  }

  return (
    <article className="recommendation-card">
      <span className="recommendation-category">{recommendation.category}</span>
      <h3>{recommendation.title}</h3>
      <p>{recommendation.description}</p>
      <div className="tag-list">
        {(recommendation.tags || []).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
      <p className="recommendation-author">Shared by {recommendation.user?.name || "a community member"}</p>
      {canManage && (
        <div className="card-actions">
          <button onClick={() => { setMessage(""); setIsEditing(true); }} type="button">Edit</button>
          <button disabled={isDeleting} onClick={handleDelete} type="button">{isDeleting ? "Deleting..." : "Delete"}</button>
        </div>
      )}
      {message && <p className="form-message" role="alert">{message}</p>}
    </article>
  );
}

export default RecommendationCard;

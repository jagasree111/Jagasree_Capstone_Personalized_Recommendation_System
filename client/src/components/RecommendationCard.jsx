import { useState } from "react";

function RecommendationCard({ recommendation, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(recommendation.title);
  const [description, setDescription] = useState(recommendation.description);
  const [category, setCategory] = useState(recommendation.category);
  const [tags, setTags] = useState(
    (recommendation.tags || []).join(", ")
  );

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/recommendations/${recommendation._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            category,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== ""),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert("Recommendation updated successfully!");

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update recommendation");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recommendation?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/recommendations/${recommendation._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      alert("Recommendation deleted successfully!");

      onUpdate();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete recommendation");
    }
  };

  if (isEditing) {
    return (
      <div className="recommendation-card">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags separated by commas"
        />

        <button onClick={handleUpdate}>Save</button>

        <button onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="recommendation-card">
      <h3>{recommendation.title}</h3>

      <p>{recommendation.description}</p>

      <p>Category: {recommendation.category}</p>

      <p>Tags: {(recommendation.tags || []).join(", ")}</p>

      <button onClick={() => setIsEditing(true)}>
        Edit
      </button>

      <button onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}

export default RecommendationCard;
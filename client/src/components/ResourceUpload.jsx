import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function ResourceUpload() {
  const fileInputRef = useRef(null);
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    fetch(`${API_URL}/uploads`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load resources");
        setResources(data);
      })
      .catch((error) => setMessage(error.message));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Choose a file before uploading.");
      return;
    }

    setIsUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed");

      setResources((current) => [data.resource, ...current]);
      setTitle("");
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("Resource uploaded successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    try {
      const response = await fetch(`${API_URL}/uploads/${resourceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");
      setResources((current) => current.filter(({ _id }) => _id !== resourceId));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="resource-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Community library</p>
          <h2>Share a useful resource</h2>
        </div>
        <span className="upload-limit">PDF, DOCX, PNG, JPG · 5 MB max</span>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label>
          Resource title
          <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required />
        </label>
        <label>
          Short description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} rows="3" />
        </label>
        <label className="file-picker">
          File
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(event) => setFile(event.target.files[0] || null)} required />
          <span>{file ? file.name : "Choose a file"}</span>
        </label>
        <button className="primary-button" type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload resource"}
        </button>
      </form>

      {message && <p className="form-message" role="status">{message}</p>}

      <div className="resource-list">
        {resources.length === 0 ? (
          <p className="empty-state">Your shared resources will appear here.</p>
        ) : resources.map((resource) => (
          <article className="resource-item" key={resource._id}>
            <div>
              <p className="resource-type">{resource.mimeType.split("/").pop().toUpperCase()}</p>
              <h3>{resource.title}</h3>
              {resource.description && <p>{resource.description}</p>}
              <small>{resource.originalName} · {formatBytes(resource.size)}</small>
            </div>
            <div className="resource-actions">
              <a href={`${API_URL}${resource.url}`} target="_blank" rel="noreferrer">Open</a>
              <button type="button" onClick={() => handleDelete(resource._id)} aria-label={`Delete ${resource.title}`}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ResourceUpload;

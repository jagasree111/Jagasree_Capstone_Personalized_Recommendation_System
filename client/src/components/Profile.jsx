import { useEffect, useState } from "react";
import { API_URL, fetchWithBackendError } from "../api";

async function readProfileResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("The backend returned a webpage instead of profile data. Restart the backend and try again.");
  }
  return response.json();
}

function Profile({ user, onProfileUpdated }) {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [interests, setInterests] = useState((user?.interests || []).join(", "));
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchWithBackendError(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await readProfileResponse(response);
        if (response.status === 404) {
          throw new Error("This account is missing from the active database. Restore the backend database connection, then sign in again.");
        }
        if (!response.ok) throw new Error(data.message || "Could not load your profile.");

        setName(data.name || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setInterests((data.interests || []).join(", "));
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetchWithBackendError(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          interests: interests.split(",").map((interest) => interest.trim()).filter(Boolean),
        }),
      });
      const data = await readProfileResponse(response);
      if (response.status === 404) {
        throw new Error("This account is missing from the active database. Restore the backend database connection, then sign in again.");
      }
      if (!response.ok) throw new Error(data.message || "Could not update your profile.");

      onProfileUpdated(data.user);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="profile-panel"><p role="status">Loading your profile...</p></div>;
  }

  return (
    <section className="profile-panel" aria-labelledby="profile-title">
      <div className="profile-header">
        <span className="profile-avatar" aria-hidden="true">{name?.trim()?.[0]?.toUpperCase() || "Y"}</span>
        <div>
          <p className="eyebrow">Your account</p>
          <h2 id="profile-title">Profile</h2>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required />
        </label>
        <label>
          Email
          <input value={email} readOnly />
        </label>
        <label>
          Learning interests <span className="optional-label">Separate with commas</span>
          <input
            value={interests}
            onChange={(event) => setInterests(event.target.value)}
            placeholder="Artificial intelligence, Design, Photography"
            maxLength={300}
          />
        </label>
        <label>
          About you
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="What are you hoping to learn?"
            maxLength={500}
            rows="5"
          />
          <span className="profile-counter">{bio.length}/500</span>
        </label>
        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>

      {message && <p className="profile-message" role="status">{message}</p>}
    </section>
  );
}

export default Profile;

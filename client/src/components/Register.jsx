import { useState } from "react";
import { authRequest } from "../api";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setRegistered(false);

    try {
      await authRequest("/auth/register", { name, email, password });

      setMessage("Registration successful! Please log in.");
      setRegistered(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-panel">
      <p className="eyebrow">Make space for what’s next</p>
      <h2>Create your account</h2>
      <p className="auth-intro">Bring your favorite resources and new learning ideas together in one place.</p>

      <form onSubmit={handleRegister}>
        <input
          aria-label="Name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          aria-label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          aria-label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
      {registered && (
        <button type="button" onClick={() => setPage("login")}>
          Go to login
        </button>
      )}
      {!registered && (
        <p className="auth-switch">
          Already have an account? <button onClick={() => setPage("login")} type="button">Sign in</button>
        </p>
      )}
    </div>
  );
}

export default Register;
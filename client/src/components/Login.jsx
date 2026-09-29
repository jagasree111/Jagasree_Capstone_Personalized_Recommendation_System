import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasGoogleClientId = Boolean(
    googleClientId && !googleClientId.toLowerCase().startsWith("your-")
  );

  useEffect(() => {
    if (!hasGoogleClientId || !googleButtonRef.current) {
      return undefined;
    }

    const handleGoogleResponse = async (response) => {
      try {
        const result = await fetch(`${API_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });
        const data = await result.json();

        if (!result.ok) {
          setMessage(data.message || "Google login failed. Please try again.");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful!");
        setPage("home");
      } catch {
        setMessage("Google login failed. Please try again.");
      }
    };

    const renderGoogleButton = () => {
      if (window.google?.accounts?.id && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          width: 300,
        });
      }
    };

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    const script = existingScript || document.createElement("script");

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      script.addEventListener("load", renderGoogleButton);
    }

    if (!existingScript) {
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", renderGoogleButton);
    };
  }, [googleClientId, hasGoogleClientId, setPage]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");
      setPage("home");
    } catch {
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-panel">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <div className="auth-divider"><span>or</span></div>

      {hasGoogleClientId ? (
        <div className="google-button" ref={googleButtonRef} />
      ) : (
        <button
          className="google-fallback-button"
          type="button"
          onClick={() => setMessage("Replace YOUR_GOOGLE_WEB_CLIENT_ID in client/.env with your Google Web Client ID, then restart the frontend.")}
        >
          Continue with Google
        </button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
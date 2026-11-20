function Navbar({ setPage, isAuthenticated, user, onLogout, onNavigate }) {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <button className="brand" type="button" onClick={() => setPage("home")} aria-label="Go to home">
        <span className="brand-mark" aria-hidden="true">✳</span>
        <span>Gather<span className="brand-period">.</span></span>
      </button>

      <div className="nav-links">
        <button className="nav-link" onClick={() => setPage("home")} type="button">Home</button>
        {isAuthenticated && (
          <>
            <button className="nav-link" onClick={() => onNavigate("discover")} type="button">Discover</button>
            <button className="nav-link" onClick={() => onNavigate("library")} type="button">My library</button>
            <button className="nav-link" onClick={() => onNavigate("recommendations")} type="button">Community</button>
          </>
        )}
      </div>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="nav-user" title={user?.email || ""}>
              <span className="user-avatar" aria-hidden="true">{user?.name?.trim()?.[0]?.toUpperCase() || "Y"}</span>
              <span className="nav-user-name">{user?.name?.split(" ")[0] || "Your space"}</span>
            </span>
            <button className="nav-signin" onClick={() => setPage("profile")} type="button">Profile</button>
            <button className="nav-signin" onClick={onLogout} type="button">Sign out</button>
          </>
        ) : (
          <>
            <button className="nav-link" onClick={() => setPage("login")} type="button">Sign in</button>
            <button className="nav-cta" onClick={() => setPage("register")} type="button">Get started <span aria-hidden="true">→</span></button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
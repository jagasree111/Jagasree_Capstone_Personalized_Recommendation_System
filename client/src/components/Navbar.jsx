function Navbar({ setPage }) {
  return (
    <nav>
      <h2>Personalized Recommendation System</h2>

      <div>
        <button onClick={() => setPage("home")}>Home</button>

        <button onClick={() => setPage("login")}>Login</button>

        <button onClick={() => setPage("register")}>Register</button>
      </div>
    </nav>
  );
}

export default Navbar;
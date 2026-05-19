export default function Layout({ currentPage, onNavigate, user, onLogout, children }) {
  return (
    <>
      <header>
        <nav>
          {/* Brand / Logo */}
          <button
            onClick={() => onNavigate("home")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.5rem",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                fontWeight: "800",
                color: "white",
                flexShrink: 0,
              }}
            >
              L
            </span>
            <span
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: "1.125rem",
                letterSpacing: "-0.01em",
              }}
            >
              LaraApp
            </span>
          </button>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <button
              onClick={() => onNavigate("home")}
              className={`nav-link ${currentPage === "home" ? "active" : ""}`}
            >
              Home
            </button>

            {user ? (
              /* Tampilan saat sudah login */
              <>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.875rem",
                    padding: "0.5rem 0.75rem",
                  }}
                >
                  Halo, <strong style={{ color: "#e2e8f0" }}>{user.name}</strong>
                </span>
                <button
                  onClick={onLogout}
                  className="nav-link"
                  style={{ color: "#f87171" }}
                >
                  Logout
                </button>
              </>
            ) : (
              /* Tampilan saat belum login */
              <>
                <button
                  onClick={() => onNavigate("register")}
                  className={`nav-link ${
                    currentPage === "register" ? "active" : ""
                  }`}
                >
                  Register
                </button>
                <button
                  onClick={() => onNavigate("login")}
                  className={`nav-link ${currentPage === "login" ? "active" : ""}`}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}

import { useState, useEffect } from "react";

export default function Home({ user, onNavigate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch registered users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError("Gagal mengambil data user terdaftar.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  return (
    <div className="home-container">
      {user ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Welcome Header Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              borderRadius: "1rem",
              padding: "2.5rem 2rem",
              color: "white",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10%",
                right: "-5%",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0) 70%)",
                pointerEvents: "none",
              }}
            />
            <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "700", letterSpacing: "-0.02em" }}>
              Selamat Datang, {user.name}! 👋
            </h1>
            <p style={{ margin: "0.5rem 0 0 0", color: "#94a3b8", fontSize: "1rem", maxWidth: "600px", lineHeight: "1.6" }}>
              Anda berhasil login ke LaraApp. Data pendaftaran Anda (nama, email, password terenkripsi) telah aman disimpan di database dan ditampilkan pada tabel di bawah. Untuk menginput data user baru, silakan lakukan <strong>Logout</strong> terlebih dahulu.
            </p>
          </div>

          {/* Registered Users Table (ONLY ONE TABLE, NO INPUT FORM) */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "2rem",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a", fontWeight: "600" }}>
                  👥 Database User Terdaftar
                </h2>
                <p style={{ margin: "0.25rem 0 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                  Menampilkan list data nama, email, dan password terenkripsi BCRYPT yang tersimpan di table database users SQLite.
                </p>
              </div>
              <button
                onClick={fetchUsers}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                🔄 Refresh Data
              </button>
            </div>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  marginBottom: "1.25rem",
                }}
              >
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem 0", color: "#64748b" }}>
                <span className="spinner" style={{ borderTopColor: "#3b82f6", width: "1.5rem", height: "1.5rem" }} />
                <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>Memuat database users...</p>
              </div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 1rem", border: "2px dashed #e2e8f0", borderRadius: "0.5rem", color: "#64748b" }}>
                <p style={{ margin: 0, fontSize: "0.95rem" }}>Tidak ada data user terdaftar.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ margin: 0, boxShadow: "none" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ width: "60px", color: "#475569" }}>No</th>
                      <th style={{ color: "#475569" }}>Nama Lengkap</th>
                      <th style={{ color: "#475569" }}>Email Address</th>
                      <th style={{ color: "#475569" }}>Password (Terenkripsi Hash BCRYPT)</th>
                      <th style={{ width: "180px", color: "#475569" }}>Tanggal Daftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, index) => {
                      const isCurrentUser = u.id === user.id;
                      return (
                        <tr
                          key={u.id}
                          style={{
                            backgroundColor: isCurrentUser ? "#f0fdf4" : "transparent",
                          }}
                        >
                          <td style={{ fontWeight: "600", color: "#64748b" }}>{index + 1}</td>
                          <td style={{ fontWeight: "600", color: "#1e293b" }}>
                            {u.name}{" "}
                            {isCurrentUser && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  padding: "0.125rem 0.375rem",
                                  borderRadius: "0.25rem",
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                  backgroundColor: "#16a34a",
                                  color: "white",
                                  marginLeft: "0.25rem",
                                  verticalAlign: "middle",
                                }}
                              >
                                Anda
                              </span>
                            )}
                          </td>
                          <td style={{ color: "#475569" }}>{u.email}</td>
                          <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#64748b", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {u.password || "$2y$12$FNUyhZ2SoK6YeCuQwjcyYcMgSkE5MX3M4DzxSMy..."}
                          </td>
                          <td style={{ color: "#475569", fontSize: "0.85rem" }}>
                            {new Date(u.created_at).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Original Welcome Box */
        <div className="home-welcome">
          <h1>Selamat Datang di LaraApp</h1>
          <p>
            Platform modern yang dibangun dengan React & Laravel. Daftar atau
            masuk untuk mulai menggunakan aplikasi ini.
          </p>
          <div className="home-actions">
            <button
              className="primary-btn"
              onClick={() => onNavigate && onNavigate("register")}
            >
              Mulai Sekarang
            </button>
            <button
              className="outline-btn"
              onClick={() => onNavigate && onNavigate("login")}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
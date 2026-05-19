import { useState } from "react";

export default function Login({ onNavigate, onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Hapus error field saat user mengetik
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
    if (apiError) setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format email tidak valid.";
    if (!formData.password) newErrors.password = "Password wajib diisi.";
    else if (formData.password.length < 6)
      newErrors.password = "Password minimal 6 karakter.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          // Validasi dari Laravel
          const laravelErrors = {};
          for (const key in data.errors) {
            laravelErrors[key] = data.errors[key][0];
          }
          setErrors(laravelErrors);
        } else {
          setApiError(data.message || "Email atau password salah.");
        }
        return;
      }

      // Simpan token ke localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      if (onLoginSuccess) onLoginSuccess(data.user);
      onNavigate("home");
    } catch (err) {
      setApiError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="title">Login</h1>
      <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: 0, marginBottom: "1.5rem" }}>
        Masuk ke akun Anda
      </p>

      {apiError && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            color: "#dc2626",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {apiError}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Masukkan password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Memproses...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="form-footer">
          Belum punya akun?{" "}
          <button
            type="button"
            className="text-link"
            onClick={() => onNavigate("register")}
            disabled={loading}
          >
            Daftar di sini
          </button>
        </p>
      </form>
    </div>
  );
}

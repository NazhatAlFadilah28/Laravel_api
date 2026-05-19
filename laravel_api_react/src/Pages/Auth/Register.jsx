import { useState } from "react";

export default function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // id "confirm-password" dipetakan ke field password_confirmation
    const fieldKey = id === "confirm-password" ? "password_confirmation" : id;
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
    if (errors[fieldKey]) setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    if (apiError) setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama wajib diisi.";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Nama minimal 3 karakter.";

    if (!formData.email.trim()) newErrors.email = "Email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format email tidak valid.";

    if (!formData.password) newErrors.password = "Password wajib diisi.";
    else if (formData.password.length < 8)
      newErrors.password = "Password minimal 8 karakter.";

    if (!formData.password_confirmation)
      newErrors.password_confirmation = "Konfirmasi password wajib diisi.";
    else if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "Password tidak cocok.";

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
    setSuccessMsg("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const laravelErrors = {};
          for (const key in data.errors) {
            laravelErrors[key] = data.errors[key][0];
          }
          setErrors(laravelErrors);
        } else {
          setApiError(data.message || "Registrasi gagal. Coba lagi.");
        }
        return;
      }

      // Simpan token jika langsung login setelah register
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      setSuccessMsg("Registrasi berhasil! Silakan login.");
      setTimeout(() => onNavigate("login"), 1500);
    } catch (err) {
      setApiError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="title">Buat Akun</h1>
      <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: 0, marginBottom: "1.5rem" }}>
        Daftar untuk memulai
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

      {successMsg && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            color: "#16a34a",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {successMsg}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Nama Lengkap</label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

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
            placeholder="Minimal 8 karakter"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Konfirmasi Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Ulangi password"
            value={formData.password_confirmation}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.password_confirmation && (
            <p className="error">{errors.password_confirmation}</p>
          )}
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Mendaftar...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </button>

        <p className="form-footer">
          Sudah punya akun?{" "}
          <button
            type="button"
            className="text-link"
            onClick={() => onNavigate("login")}
            disabled={loading}
          >
            Login di sini
          </button>
        </p>
      </form>
    </div>
  );
}

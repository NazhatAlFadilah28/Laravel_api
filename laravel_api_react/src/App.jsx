import { useState } from "react";
import "./App.css";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(() => {
    // Cek apakah sudah login dari localStorage
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (_) {
      // Tetap logout meski request gagal
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setUser(null);
      setCurrentPage("home");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <Login
            onNavigate={setCurrentPage}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case "register":
        return <Register onNavigate={setCurrentPage} />;
      default:
        return <Home user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      user={user}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}

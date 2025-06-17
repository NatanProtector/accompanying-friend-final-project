import React, { useState } from "react";
import "./AdminLogin.css";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_SERVER_URL;
const Admin_secret = import.meta.env.VITE_ADMIN_SECRET;

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    idNumber: "",
    password: "",
    adminSecret: Admin_secret,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      
      const response = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token in localStorage
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));

        // Call success callback
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idNumber">ID Number:</label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <h1 style={titleStyle}>Accompanying Friend</h1>
    </div>
  );
};

export default AdminLogin;

const titleStyle = {
  margin: "20px",
}
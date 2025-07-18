import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import MyMap from "./components/MapScreen";
import Home from "./components/Home";
import BasicScreen from "./components/BasicScreen";
import Header from "./components/Header";
import ManageUsers from "./components/ManageUsers";
import AdminLogin from "./components/AdminLogin";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setAdminToken(token);
        setAdminUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token, user) => {
    setAdminToken(token);
    setAdminUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminToken(null);
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app if authenticated
  return (
    <Router>
      <BasicScreen
        header={<Header adminUser={adminUser} onLogout={handleLogout} />}
        content={
          <Routes>
            <Route
              path="/"
              element={<Home adminUser={adminUser} onLogout={handleLogout} />}
            />
            <Route
              path="/Manage/Users"
              element={<ManageUsers adminToken={adminToken} />}
            />
            <Route 
              path="/map" 
              element={<MyMap adminToken={adminToken} />} />

          </Routes>
        }
      />
    </Router>
  );
};

export default App;

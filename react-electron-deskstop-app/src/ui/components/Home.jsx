import StandardContainer from "./StandardContainer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home({ adminUser, onLogout }) {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  return (
    <StandardContainer>
      <div style={styles.container}>
        <div style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {adminUser?.firstName || "Administrator"}!
          </h1>
          <p style={styles.welcomeSubtitle}>
            This is your admin dashboard for the Accompanying Friend system.
          </p>
        </div>

        <div style={styles.tabsSection}>
          <h2 style={styles.sectionTitle}>Available Features</h2>

          <div
            style={{
              ...styles.tabCard,
              ...(hoveredCard === "users" ? styles.tabCardHovered : {}),
            }}
            onMouseEnter={() => setHoveredCard("users")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate("/Manage/Users")}
          >
            <h3 style={styles.tabTitle}>👥 Manage Users</h3>
            <p style={styles.tabDescription}>
              Review and approve pending user registrations. You can search,
              approve, or deny user requests.
            </p>
          </div>

          <div
            style={{
              ...styles.tabCard,
              ...(hoveredCard === "map" ? styles.tabCardHovered : {}),
            }}
            onMouseEnter={() => setHoveredCard("map")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate("/map")}
          >
            <h3 style={styles.tabTitle}>🗺️ Map</h3>
            <p style={styles.tabDescription}>
              View real-time user locations and monitor events. Click on the map
              to report incidents.
            </p>
          </div>
        </div>

        <div style={styles.logoutSection}>
          <button
            style={styles.logoutButton}
            onClick={onLogout}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255, 59, 48, 0.2)";
              e.target.style.boxShadow = "0 6px 16px rgba(255, 59, 48, 0.25)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(255, 59, 48, 0.1)";
              e.target.style.boxShadow = "0 4px 12px rgba(255, 59, 48, 0.15)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </StandardContainer>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    width: "100%",
    maxWidth: "800px",
    padding: "40px",
    gap: "40px",
  },
  welcomeSection: {
    textAlign: "center",
  },
  welcomeTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#646CFF",
    margin: "0 0 12px 0",
  },
  welcomeSubtitle: {
    fontSize: "16px",
    color: "#646CFF",
    margin: 0,
    fontWeight: "400",
  },
  tabsSection: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#646CFF",
    margin: "0 0 24px 0",
    textAlign: "center",
  },
  tabCard: {
    backgroundColor: "rgba(100, 108, 255, 0.05)",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 8px 25px rgba(100, 108, 255, 0.15)",
    border: "1px solid rgba(100, 108, 255, 0.2)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  tabCardHovered: {
    backgroundColor: "rgba(100, 108, 255, 0.15)",
    boxShadow: "0 12px 35px rgba(100, 108, 255, 0.25)",
    border: "1px solid rgba(100, 108, 255, 0.4)",
    transform: "translateY(-2px)",
  },
  tabTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#646CFF",
    margin: "0 0 12px 0",
  },
  tabDescription: {
    fontSize: "16px",
    color: "#646CFF",
    margin: 0,
    lineHeight: "1.5",
    opacity: 0.8,
  },
  logoutSection: {
    marginTop: "auto",
    paddingTop: "40px",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    color: "#FF3B30",
    border: "1px solid rgba(255, 59, 48, 0.3)",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "20px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(255, 59, 48, 0.15)",
  },
};

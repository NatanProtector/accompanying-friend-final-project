import StandardContainer from "./StandardContainer";

export default function Home({ adminUser, onLogout }) {
  return (
    <StandardContainer>
      <div style={style.container}>
        <h2>Home Page</h2>
        <button onClick={onLogout} style={style.logoutButton}>
          Logout
        </button>
      </div>
    </StandardContainer>
  );
}

const style = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    gap: "20px",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

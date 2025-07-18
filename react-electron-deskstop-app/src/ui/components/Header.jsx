import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Welcome to Accompanying Friend";
      case "/Manage/Users":
        return "Manage User Registration and Permissions";
      case "/map":
        return "View Real-time User Locations";
      default:
        return "";
    }
  };

  return (
    <nav style={style.nav}>
      <ul style={style.ul}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Manage/Users">Manage Users</Link>
        </li>
        <li>
          <Link to="/map">Map</Link>
        </li>
      </ul>

      <div style={style.titleContainer}>
        <span style={style.title}>{getTitle()}</span>
      </div>
    </nav>
  );
};

const style = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "10px 0",
  },
  ul: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    padding: 0,
    marginLeft: "20px",
  },
  titleContainer: {
    marginRight: "20px",
  },
  title: {
    color: "#666",
    fontSize: "1.1em",
    fontWeight: "500",
  },
};

export default Header;

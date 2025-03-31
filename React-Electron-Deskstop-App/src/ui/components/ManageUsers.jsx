import React, { useState } from "react";
import StandardContainer from "./StandardContainer";
import { getAllPendingUsers, getUsersByEmail, getUsersByUserId, getUsersById } from "../../utils/Communication";
import UserDisplay from "./UserDisplay";

const ManageUsers = () => {
  // State for search input and selected search criteria
  const [searchValue, setSearchValue] = useState("");
  const [searchBy, setSearchBy] = useState("email");
  const [userType, setUserType] = useState("pending");

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // State to track selected users

  // Fetch pending users on mount
  useState(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllPendingUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    if (!selectedUsers.includes(user)) {
        setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    }
  }

  const handleUserUnselect = (user) => {
    if (selectedUsers.includes(user)) {
        setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter((selectedUser) => selectedUser !== user));
    }
  }


  // Handler for the search button
  const handleSearch = () => {
    console.log(`Searching for ${searchValue} by ${searchBy} in user type ${userType}`);
  };

  // Handler for the "Show All Pending Users" button
  const handleShowAllPendingUsers = async () => {
    try {
      const pendingUsers = await getAllPendingUsers();
      console.log("Pending Users:", pendingUsers);
      setUsers(pendingUsers);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  return (
    <StandardContainer>
      <div style={style.container}>
        {/* Top-right button (only visible when there are selected users) */}
        
        {selectedUsers.length > 0 && (
          <button style={style.topRightButton}>
            Selected Users ({selectedUsers.length})
          </button>
        )}

        <div style={style.header}>
          <h2>Manage Users Page</h2>
          <div style={style.controls}>
            {/* Text input for search */}
            <input
              type="text"
              placeholder="Enter search value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={style.input}
            />

            {/* Select input for search criteria */}
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              style={style.select}
            >
              <option value="email">Email</option>
              <option value="userId">User ID</option>
              <option value="IDnumber">ID Number</option>
            </select>

            {/* Select input for user type criteria */}
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={style.select}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="All">All</option>
            </select>

            {/* Search button */}
            <button onClick={handleSearch} style={style.button}>
              Search
            </button>

            {/* Show All Pending Users button */}
            <button onClick={handleShowAllPendingUsers} style={style.button}>
              Show All Pending Users
            </button>
          </div>

          {/* Display users */}
          <div style={style.content}>
            {users.map((user) => (
              <UserDisplay
                key={user.id}
                user={user}
                onSelect={() => handleUserSelect(user)}
                onUnselect={() => handleUserUnselect(user)}
              />
            ))}
          </div>
        </div>
      </div>
    </StandardContainer>
  );
};

export default ManageUsers;

const style = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    width: "100%",
    position: "relative", // Ensure top-right button is positioned correctly
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  controls: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "200px",
  },
  select: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  topRightButton: {
    position: "fixed", // Fixed positioning
    top: "10px", // Distance from the top of the viewport
    right: "10px", // Distance from the right of the viewport
    padding: "8px 16px", // Button padding
    borderRadius: "4px", // Rounded corners
    border: "none", // No border
    backgroundColor: "#28a745", // Green color for visibility
    color: "#fff", // White text color
    cursor: "pointer", // Pointer cursor on hover
  },
};

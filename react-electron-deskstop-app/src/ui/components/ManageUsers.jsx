import React, { useState, useEffect } from "react";
import StandardContainer from "./StandardContainer";
import {
  getAllPendingUsers,
  approveUsers,
  denyUsers,
} from "../../utils/communication";
import UserDisplay from "./UserDisplay";

const ManageUsers = () => {
  // State for search input and selected search criteria
  const [searchValue, setSearchValue] = useState("");
  const [searchBy, setSearchBy] = useState("email");
  const [userType, setUserType] = useState("pending");

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // State to track selected users

  // Fetch pending users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllPendingUsers();
        console.log("Response:", response);
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
  };

  const handleUserUnselect = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((selectedUser) => selectedUser !== user)
      );
    }
  };

  // Handler for the search button
  const handleSearch = () => {
    console.log(
      `Searching for ${searchValue} by ${searchBy} in user type ${userType}`
    );
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

  // Handler for approving selected users
  const handleApproveUsers = async () => {
    const idNumbers = selectedUsers.map((user) => user.idNumber);
    console.log("Approving users with ID numbers:", idNumbers);
    try {
      const result = await approveUsers(idNumbers);
      console.log("Approval result:", result);
      // Refresh the user list and clear selection
      handleShowAllPendingUsers(); // Re-fetch pending users
      setSelectedUsers([]);
      // Optionally show a success message to the user
      alert(result.message);
    } catch (error) {
      console.error("Error approving users:", error);
      // Optionally show an error message to the user
      alert(`Failed to approve users: ${error.message}`);
    }
  };

  // Handler for denying selected users
  const handleDenyUsers = async () => {
    const idNumbers = selectedUsers.map((user) => user.idNumber);
    console.log("Denying users with ID numbers:", idNumbers);
    try {
      const result = await denyUsers(idNumbers);
      console.log("Denial result:", result);
      // Refresh the user list and clear selection
      handleShowAllPendingUsers(); // Re-fetch pending users
      setSelectedUsers([]);
      // Optionally show a success message to the user
      alert(result.message);
    } catch (error) {
      console.error("Error denying users:", error);
      // Optionally show an error message to the user
      alert(`Failed to deny users: ${error.message}`);
    }
  };

  return (
    <StandardContainer>
      <div style={style.container}>
        {/* Top-right buttons container (only visible when there are selected users) */}
        {selectedUsers.length > 0 && (
          <div style={style.topRightButtonsContainer}>
            <button onClick={handleApproveUsers} style={style.approveButton}>
              Approve Users ({selectedUsers.length})
            </button>
            <button onClick={handleDenyUsers} style={style.denyButton}>
              Deny Users ({selectedUsers.length})
            </button>
          </div>
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
            {users.length > 0 ? (
              users.map((user) => (
                <UserDisplay
                  key={user._id || user.idNumber}
                  user={user}
                  onSelect={() => handleUserSelect(user)}
                  onUnselect={() => handleUserUnselect(user)}
                />
              ))
            ) : (
              <p>No Pending users</p>
            )}
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
    position: "relative",
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
  topRightButtonsContainer: {
    position: "fixed",
    top: "50%",
    right: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 1000,
  },
  approveButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
  denyButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};

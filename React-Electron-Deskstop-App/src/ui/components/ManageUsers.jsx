import React, { useState } from "react";
import StandardContainer from "./StandardContainer";
import { getPendingUsers } from "../../utils/Communication";

const ManageUsers = () => {
    // State for search input and selected search criteria
    const [searchValue, setSearchValue] = useState("");
    const [searchBy, setSearchBy] = useState("email");

    // Handler for the search button
    const handleSearch = () => {
        console.log(`Searching for ${searchValue} by ${searchBy}`);
        // Add logic to perform search based on `searchValue` and `searchBy`
    };

    // Handler for the "Show All Pending Users" button
    const handleShowAllPendingUsers = async () => {
        try {
            const pendingUsers = await getPendingUsers();
            console.log("Pending Users:", pendingUsers);
            // Add logic to display pending users
        } catch (error) {
            console.error("Error fetching pending users:", error);
        }
    };

    return (
        <StandardContainer>
            <div style={style.container}>
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

                        {/* Search button */}
                        <button onClick={handleSearch} style={style.button}>
                            Search
                        </button>

                        {/* Show All Pending Users button */}
                        <button onClick={handleShowAllPendingUsers} style={style.button}>
                            Show All Pending Users
                        </button>
                    </div>
                </div>
            </div>
        </StandardContainer>
    );
};

export default ManageUsers;

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: "100%",
        width: "100%",
    },
    header: {
        textAlign: "center",
        marginBottom: "20px",
    },
    controls: {
        display: "flex",
        flexDirection: "row",
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
};

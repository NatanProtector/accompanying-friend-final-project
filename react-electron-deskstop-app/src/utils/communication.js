const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const getAllPendingUsers = () => {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/auth/pending-users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error fetching pending users:", error);
        reject(error);
      });
  });
};

export const getUsersByEmail = (email) => {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/auth/get-user/${email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

export const getUsersByUserId = (userID) => {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/auth/get-user-by-id/${userID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

export const getUsersById = (Id) => {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/auth/get-user-by-idNumber/${Id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

export const approveUsers = (idNumbers) => {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/auth/update-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idNumbers, newStatus: "approved" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error approving users:", error);
        reject(error);
      });
  });
};

export const denyUsers = (idNumbers) => {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/auth/update-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idNumbers, newStatus: "denied" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error denying users:", error);
        reject(error);
      });
  });
};

export const ReportEmergency = async (eventType, clickedPosition) => {
  const { lat, lng } = clickedPosition;

  const payload = {
    eventType: eventType || "Unknown",
    location: { type: "Point", coordinates: [lng, lat] },
    instructions: "",
    voiceCommands: "",
    relatedUsers: [],
  };

  console.log("[ReportEmergency] Payload:", payload);

  try {
    // Get admin token from localStorage
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      console.error("[ReportEmergency] No admin token found");
      throw new Error("Admin authentication required");
    }

    const response = await fetch(`${SERVER_URL}/api/events/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("[ReportEmergency] Event reported successfully:", data);
    return data;
  } catch (error) {
    console.error("[ReportEmergency] Error reporting event:", error);
    throw error;
  }
};

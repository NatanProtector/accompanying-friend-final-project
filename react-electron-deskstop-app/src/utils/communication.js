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

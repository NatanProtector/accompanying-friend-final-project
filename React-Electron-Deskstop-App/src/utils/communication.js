const getPendingUsers = (shouldReject = false) => {
    return new Promise((resolve, reject) => {
        // Simulate fetching pending users from the server
        setTimeout(() => {
            if (shouldReject) {
                // Simulate an error
                reject(new Error("Failed to fetch pending users"));
                return;
            }

            const pendingUsers = [
                {
                    firstName: "John",
                    lastName: "Doe",
                    fullName: "John Doe",
                    phone: "1234567890",
                    idNumber: "987654321",
                    email: "john.doe@example.com",
                    idPhoto: null,
                    registrationStatus: "pending",
                    location: {
                        type: "Point",
                        coordinates: [34.7818, 32.0853], // Example coordinates (Tel Aviv)
                    },
                },
                {
                    firstName: "Jane",
                    lastName: "Smith",
                    fullName: "Jane Smith",
                    phone: "0987654321",
                    idNumber: "123456789",
                    email: "jane.smith@example.com",
                    idPhoto: null,
                    registrationStatus: "pending",
                    location: {
                        type: "Point",
                        coordinates: [-73.935242, 40.730610], // Example coordinates (New York)
                    },
                },
                {
                    firstName: "Alice",
                    lastName: "Johnson",
                    fullName: "Alice Johnson",
                    phone: "1122334455",
                    idNumber: "5566778899",
                    email: "alice.johnson@example.com",
                    idPhoto: null,
                    registrationStatus: "pending",
                    location: {
                        type: "Point",
                        coordinates: [139.691711, 35.689487], // Example coordinates (Tokyo)
                    },
                },
            ];

            resolve(pendingUsers); // Resolve with the list of pending users
        }, 1000); // Simulate a delay of 1 second
    });
};

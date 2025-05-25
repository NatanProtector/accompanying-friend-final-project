import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import { SERVER_URL } from "@env";

const splitFullName = (fullName) => {
  fullName = fullName.trim();
  const [firstName, ...lastNameParts] = fullName.split(/\s+/);
  const lastName = lastNameParts.join(" ");

  return { firstName, lastName };
};

export const authorizedFetch = async (url, options = {}) => {
  const token = await AsyncStorage.getItem("authToken");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(url, { ...options, headers });
};

export const SubmitRegisterForm = (formData) => {
  // Reformat full name to first name and last name
  const { firstName, lastName } = splitFullName(formData.fullName);

  // reconstruct formData to { firstName, lastName, phone, idNumber, email, idPhoto }
  formData = {
    firstName,
    lastName,
    phone: formData.phone,
    idNumber: formData.idNumber,
    email: formData.email,
    password: formData.password,
    idPhoto: formData.idPhoto,
    multiRole:
      formData.registerAs === "both"
        ? ["citizen", "security"]
        : [formData.registerAs || "citizen"],
    securityCertificatePhoto: formData.securityCertificatePhoto || null,
  };

  // console.log("Form Data:", formData);
  console.log("SERVER_URL:", SERVER_URL);

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("test 1");

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      console.log("test 2");

      const data = await response.json();
      console.log("Server Response:", data);

      resolve(data);
    } catch (error) {
      console.log("Submission failed:", error);
      reject(error);
    }
  });
};

export const SubmitLoginForm = async (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const ReportEmergency = async (selectedOption) => {
  const token = await AsyncStorage.getItem("authToken");

  if (!token) {
    throw new Error("User not authenticated");
  }

  console.log("[ReportEmergency] Selected:", selectedOption);

  const eventTypeMap = {
    option1: "Vehicle Theft Attempt",
    option2: "Shooting",
    option3: "Molotov",
  };

  // Get real GPS location
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Location permission not granted");
  }

  const currentLocation = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = currentLocation.coords;

  const payload = {
    eventType: eventTypeMap[selectedOption] || "Unknown",
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    instructions: "Reported via app",
    voiceCommands: "",
    relatedUsers: [],
  };

  console.log("[ReportEmergency] Payload:", payload);

  try {
    const response = await authorizedFetch(`${SERVER_URL}/api/events/report`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to report event");
    }

    const data = await response.json();
    console.log("[ReportEmergency] Server response:", data);
    return data;
  } catch (err) {
    console.log("[ReportEmergency] Error:", err.message);
  }
};

export const SubmitAccountRecovery = async (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/auth/recover-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Account recovery failed");
      }

      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyRecaptchaToken = async (token) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/recaptcha/verify-recaptcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "reCAPTCHA verification failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error verifying reCAPTCHA token:", error);
    throw error;
  }
};

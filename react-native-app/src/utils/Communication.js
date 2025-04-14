import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import { SERVER_URL } from "@env";

const splitFullName = (fullName) => {
  fullName = fullName.trim();
  const [firstName, ...lastNameParts] = fullName.split(/\s+/);
  const lastName = lastNameParts.join(' ');
  
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

  console.log("Sending Form Data:", formData);

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

  return new Promise(async (resolve, reject) => {
    try {
      console.log("Form Data:", `${SERVER_URL}/api/auth/register`);
      const response = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("test");
      

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Server Response:", data);
      resolve(data);
    } catch (error) {
      console.error("Submission failed:", error);
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
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log("Login Success:", data);
      resolve(data);
    } catch (error) {
      console.error("Login Error:", error);
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
if (status !== 'granted') {
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
    console.error("[ReportEmergency] Error:", err.message);
    throw err;
  }
};


export const SearchLocation = async (formData) => {
    return new Promise((resolve, reject) => {
      console.log('Form Data:', formData);
      
      // Simulate success or failure:
      const shouldFail = true; // Change to true to simulate failure
  
      if (shouldFail) {
        reject(new Error('Submission failed'));
      } else {
        resolve('Form submitted successfully');
      }
    });
}


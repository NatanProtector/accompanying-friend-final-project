
const SERVER_URL = "http://192.168.1.228:3001";

const splitFullName = (fullName) => {
  fullName = fullName.trim();
  const [firstName, ...lastNameParts] = fullName.split(/\s+/);
  const lastName = lastNameParts.join(' ');
  
  return { firstName, lastName };
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
    password: formData.password, // ✅ Add this
    idPhoto: formData.idPhoto,
    multiRole:
    formData.registerAs === "both"
      ? ["citizen", "security"]
      : [formData.registerAs || "citizen"],
    securityCertificatePhoto: formData.securityCertificatePhoto || null, // optional
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

      // For testing, new input will be accepted always after one second =============
      if (formData.idNumber === "" || formData.password === "") {
        resolve({
          multiRole: ["citizen", "security"],
        });
        return;
      }
      // =============================================================

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


export const ReportEmergency = async (formData) => {
    return new Promise((resolve, reject) => {
      console.log('Form Data:', formData);
      
      // Simulate success or failure:
      const shouldFail = false; // Change to true to simulate failure
  
      if (shouldFail) {
        reject(new Error('Submission failed'));
      } else {
        resolve('Form submitted successfully');
      }
    });
}

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
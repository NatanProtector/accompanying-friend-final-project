
const SERVER_URL = "http://192.168.144.9:3001";

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
  formData.firstName = firstName;
  formData.lastName = lastName;

  // reconstruct formData to { firstName, lastName, phone, idNumber, email, idPhoto }
  formData = {
    firstName,
    lastName,
    phone: formData.phone,
    idNumber: formData.idNumber,
    email: formData.email,
    password: formData.password, // ✅ Add this
    idPhoto: formData.idPhoto,
    multiRole: [formData.registerAs || 'citizen'], // optional fallback
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
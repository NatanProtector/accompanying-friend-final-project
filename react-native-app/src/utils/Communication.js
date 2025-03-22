export const SubmitRegisterForm = async (formData) => {
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
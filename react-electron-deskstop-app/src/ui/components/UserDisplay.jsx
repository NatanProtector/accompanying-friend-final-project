import React, { useState } from 'react';
import PropTypes from 'prop-types';

const UserDisplay = ({ user, onSelect, onUnselect }) => {
  // State to manage the checkbox
  const [isChecked, setIsChecked] = useState(false);

  // Function to handle checkbox change
  const handleCheckboxChange = () => {
    if (isChecked)
      onUnselect && onUnselect();
    else
      onSelect && onSelect();

    setIsChecked(!isChecked);
  };

  // Destructure the user object for easier access
  const {
    firstName,
    lastName,
    fullName,
    phone,
    idNumber,
    email,
    idPhoto,
    registrationStatus,
    location: { coordinates },
  } = user;

  return (
    <div style={styles.container}>
      {/* Checkbox in the top-right corner */}
      <div style={styles.checkboxContainer}>
        <input
          style={styles.checkbox}
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>

      <h2>User Details</h2>
      <p><strong>First Name:</strong> {firstName}</p>
      <p><strong>Last Name:</strong> {lastName}</p>
      <p><strong>Full Name:</strong> {fullName}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>ID Number:</strong> {idNumber}</p>
      <p><strong>Email:</strong> {email}</p>
      {idPhoto && (
        <div>
          <strong>ID Photo:</strong>
          <br />
          <img src={idPhoto} alt="ID Photo" style={styles.image} />
        </div>
      )}
      <p><strong>Registration Status:</strong> {registrationStatus}</p>
      <p><strong>Location Coordinates:</strong> [{coordinates[0]}, {coordinates[1]}]</p>

    </div>
  );
};

// Define PropTypes for type checking
UserDisplay.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    idNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    idPhoto: PropTypes.string,
    registrationStatus: PropTypes.string.isRequired,
    location: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
  }).isRequired,
};

// Basic styling for the component
const styles = {
  container: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px auto',
    position: 'relative', // To position the checkbox in the top-right corner
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginTop: '8px',
  },
  checkboxContainer: {
    position: 'absolute',
    top: '8px',
    right: '8px',
  },
  checkbox: {
    cursor: 'pointer',
    width: '24px', 
    height: '24px', 
    borderRadius: '4px',
    border: '2px solid #007BFF',
    backgroundColor: '#fff',
    outline: 'none',
    position: 'relative',
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
  },
  checkboxLabel: {
    marginLeft: '8px',
    fontSize: '16px',
  },
};

export default UserDisplay;

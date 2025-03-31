import React from 'react';
import PropTypes from 'prop-types';

const UserDisplay = ({ user }) => {
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
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginTop: '8px',
  },
};

export default UserDisplay;

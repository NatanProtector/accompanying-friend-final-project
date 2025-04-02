import React from 'react';
import screenConfigs from '../../constants/screenConfig';

const BasicScreen = ({ header, content }) => {

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        {header}
      </div>
      <div style={styles.contentSection}>
        {content}
      </div>
    </div>
  );
};

const adjustWidth = 15
const adjustHeight = 70

const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: `${screenConfigs.height - adjustHeight}px`,
      width: `${screenConfigs.width - adjustWidth}px`,
      overflow: 'hidden',
      position: 'relative', // For absolute positioning of children
    },
    headerSection: {
      position: 'fixed', // Fixed to viewport
      top: 0,
      left: 0,
      width: '100%', 
      height: `${screenConfigs.headerHeight}px`, // Fixed height
     boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Optional: add subtle shadow
    },
    contentSection: {
      marginTop: `${screenConfigs.headerHeight}px`, // Add margin to accommodate fixed header (adjust based on header height)
      flex: 1,
      width: '100%',
      overflow: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  };

export default BasicScreen;
import DriveScreen from "./DriveScreen";

const SecurityDriveScreen = ({ route }) => {
  const { initialDestination } = route.params || {};
  return <DriveScreen initialDestination={initialDestination} userRole="security" />;
};


export default SecurityDriveScreen;


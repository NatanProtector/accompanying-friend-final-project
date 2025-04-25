import { WebView } from "react-native-webview";
import { SERVER_URL } from "@env";
import { StyleSheet } from "react-native";

export default function ReCaptcha({ navigation }) {
  const handleMessage = (event) => {
    const token = event.nativeEvent.data;
    console.log("reCAPTCHA Token:", token);
    // TODO: Send this token to your backend for verification
  };

  const recaptchaUrl = `${SERVER_URL}/recaptcha`;

  return (
    <WebView
      style={styles.container}
      source={{ uri: recaptchaUrl }} // Load from server URL
      onMessage={handleMessage}
      originWhitelist={["*"]} // Allow all origins, adjust if needed for security
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      // Optional: Render a loading indicator
      // renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Use flex: 1 to fill the available space
    // Removed fixed height/width and other styles potentially conflicting with WebView rendering
  },
});
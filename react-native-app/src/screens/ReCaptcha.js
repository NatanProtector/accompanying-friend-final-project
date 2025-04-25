import { WebView } from "react-native-webview";
import { SERVER_URL } from "@env";
import { StyleSheet } from "react-native";
import { verifyRecaptchaToken } from "../utils/Communication";

export default function ReCaptcha({ navigation }) {
  const handleMessage = async (event) => {
    const token = event.nativeEvent.data;
    console.log("reCAPTCHA Token:", token);
    try {
      await verifyRecaptchaToken(token);
      // TODO: Handle successful verification (e.g., navigate or update state)
      navigation.navigate("Home");
    } catch (error) {
      console.error("reCAPTCHA verification failed:", error);
      // TODO: Handle verification failure (e.g., show an error message)
    }
  };

  const recaptchaUrl = `${SERVER_URL}/recaptcha/recaptcha-render`;

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Use flex: 1 to fill the available space
    // Removed fixed height/width and other styles potentially conflicting with WebView rendering
  },
});

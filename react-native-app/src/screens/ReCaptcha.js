import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { SERVER_URL } from "@env";
import { verifyRecaptchaToken } from "../utils/Communication";
import BasicScreen from "../components/screen_components/BasicScreen";
import MyLanguageContext from "../utils/MyLanguageContext";
import { useContext } from "react";

const ReCaptchaText = {
  en: {
    title: "Accompanying Friend",
  },
  he: {
    title: "חבר מלווה",
  },
};

export default function ReCaptcha({ navigation }) {
  const { language } = useContext(MyLanguageContext);

  const handleMessage = async (event) => {
    const token = event.nativeEvent.data;

    try {
      await verifyRecaptchaToken(token);
      navigation.navigate("Home");
    } catch (error) {
      console.error("reCAPTCHA verification failed:", error);
    }
  };

  const recaptchaUrl = `${SERVER_URL}/api/recaptcha/recaptcha-render`;

  return (
    <BasicScreen title={ReCaptchaText[language].title} language={language}>
      <View style={styles.screen}>
        <View style={styles.webViewContainer}>
          <WebView
            style={styles.webView}
            source={{ uri: recaptchaUrl }}
            onMessage={handleMessage}
            originWhitelist={["*"]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        </View>
      </View>
    </BasicScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  webViewContainer: {
    width: "90%",
    height: 400,
    borderRadius: 10,
    overflow: "hidden",
  },
  webView: {
    flex: 1,
  },
});

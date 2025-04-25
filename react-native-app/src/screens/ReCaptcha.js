import { View, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";
import { SERVER_URL } from "@env";
import { verifyRecaptchaToken } from "../utils/Communication";
import BasicScreen from "../components/screen_components/BasicScreen";
import MyLanguageContext from "../utils/MyLanguageContext";
import { useContext } from "react";

const ReCaptchaText = {
  en: {
    title: "Accompanying Friend",
    prompt:
      "Before you get started, we just need to confirm you're not a robot.",
  },
  he: {
    title: "חבר מלווה",
    prompt: "לפני שנתחיל, אנחנו רק צריכים לוודא שאתם לא רובוט.",
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
        {/* <View style={styles.promptContainer}> */}
          <Text style={styles.prompt}>{ReCaptchaText[language].prompt}</Text>
        {/* </View> */}
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
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  webViewContainer: {
    width: "90%",
    height: 500,
    borderRadius: 10,
  },
  webView: {
    flex: 1,
  },
  prompt: {
    fontSize: 20,
    textAlign: "center",
    margin: 20,
  },
  // promptContainer: {
  //   width: "100%",
  //   height: 200,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "red",
  // },
});

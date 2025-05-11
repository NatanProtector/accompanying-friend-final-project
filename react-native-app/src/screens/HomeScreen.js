import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import MyLanguageContext from "../utils/MyLanguageContext";
import BasicScreen from "../components/screen_components/BasicScreen";
import NavButton from "../components/general_components/NavButton";
import TextFieldPassword from "../components/general_components/TextFieldPassword";
import TextFieldUsername from "../components/general_components/TextFieldUsername";
import { SubmitLoginForm } from "../utils/Communication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadModalController from "../utils/LoadModalController";

const navigateToRecovery = (navigation, setShowError) => {
  return () => {
    setShowError(false);
    navigation.navigate("Recovery");
  };
};

const navigateToRegister = (navigation) => {
  return () => {
    navigation.navigate("Register");
  };
};

export default function HomeScreen({ navigation }) {
  const { language } = useContext(MyLanguageContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const iconPosition = language === "en" ? "left" : "right";

  // Load Modal Controllers
  const { startLoad, endLoad, LoadModal } = LoadModalController();

  const displayMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const handleLogin = async () => {
    startLoad();
    try {
      // Bypass login for testing when fields are empty
      if (username === "" && password === "") {
        console.log(
          "Bypassing login for testing (empty fields) - Multi-role simulation."
        );
        // Simulate multi-role login by navigating to the role selection screen
        // Assuming 'Login' screen handles role selection based on existing logic
        navigation.navigate("Login", { multiRole: ["citizen", "security"] });
        return;
      }

      const response = await SubmitLoginForm({
        idNumber: username,
        password: password,
      });

      const { token, user } = response;
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      const { multiRole } = user;

      if (multiRole.length === 1) {
        if (multiRole[0] === "citizen") {
          navigation.navigate("Dashboard/Citizen");
        } else if (multiRole[0] === "security") {
          navigation.navigate("Dashboard/Security");
        }
      } else if (multiRole.length === 2) {
        navigation.navigate("Login", { multiRole });
      } else {
        throw new Error("Invalid multiRole at HomeScreen");
      }
    } catch (error) {
      console.log("Login failed");

      const rawMessage = error.message || "Login failed";

      // Translate based on known server messages
      if (rawMessage.includes("ID number is incorrect")) {
        displayMessage(HomeText[language].wrongCredentials);
      } else if (rawMessage.includes("Password is incorrect")) {
        displayMessage(HomeText[language].wrongCredentials);
      } else if (rawMessage.includes("pending approval")) {
        Alert.alert(
          HomeText[language].pendingApprovalTitle,
          HomeText[language].pendingApproval
        );
      } else if (rawMessage.includes("Email not verified")) {
        Alert.alert(
          HomeText[language].emailNotVerifiedTitle,
          HomeText[language].emailNotVerified
        );
      } else {
        displayMessage(HomeText[language].wrongCredentials);
      }
    } finally {
      endLoad();
    }
  };

  return (
    <BasicScreen title={HomeText[language].title} language={language}>
      <LoadModal language={language} />
      <View style={style.container}>
        <View style={style.inputContainer}>
          <TextFieldUsername
            placeholder={HomeText[language].usernamePlaceholder}
            iconPosition={iconPosition}
            language={language}
            value={username}
            onChangeText={setUsername}
          />
          <TextFieldPassword
            placeholder={HomeText[language].passwordPlaceholder}
            iconPosition={iconPosition}
            language={language}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={navigateToRecovery(navigation, setShowError)}
          >
            <Text style={style.forgotPassword}>
              {HomeText[language].forgotPassword}
            </Text>
          </TouchableOpacity>
        </View>

        <NavButton title={HomeText[language].login} onPress={handleLogin} />

        <Button
          title="Test API Routes"
          onPress={() => navigation.navigate("TestRoutes")}
          color="gold" // or "yellow"
        />

        <View
          style={[
            style.bottomContainer,
            { flexDirection: language === "he" ? "row-reverse" : "row" },
          ]}
        >
          <Text style={style.registerText}>
            {HomeText[language].notRegistered}{" "}
          </Text>
          <TouchableOpacity onPress={navigateToRegister(navigation)}>
            <Text style={style.registerLink}>
              {HomeText[language].registerHere}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Modal with Blur */}
      <Modal
        visible={showError}
        transparent
        animationType="fade"
        onRequestClose={() => setShowError(false)}
      >
        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill}>
          <View style={style.modalContainer}>
            <View style={style.errorBox}>
              <Text style={style.modalText}>{errorMessage}</Text>
              <TouchableOpacity
                style={style.closeButton}
                onPress={() => setShowError(false)}
              >
                <Text style={style.closeButtonText}>
                  {HomeText[language].close}
                </Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  onPress={navigateToRecovery(navigation, setShowError)}
                  style={{ marginTop: 30 }}
                >
                  <Text style={style.forgotPassword}>
                    {HomeText[language].forgotPassword}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </BasicScreen>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    paddingTop: 20,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  forgotPassword: {
    marginTop: -10,
    color: "blue",
    textDecorationLine: "underline",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  errorBox: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    elevation: 10,
  },
  modalText: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#4958FF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
});
const HomeText = {
  en: {
    title: "Accompanying Friend",
    login: "Login",
    register: "Register",
    passwordPlaceholder: "Password",
    usernamePlaceholder: "ID Number",
    forgotPassword: "Forgot password?",
    notRegistered: "Not registered?",
    registerHere: "Register here",
    wrongCredentials: "Wrong username or password.",
    pendingApprovalTitle: "Pending Approval",
    pendingApproval: "Your request is still pending approval.",
    emailNotVerified:
      "Email not verified. verification link not recieved? please contact support",
    emailNotVerifiedTitle: "Email Verification Required",
    close: "Close",
  },
  he: {
    title: "חבר מלווה",
    login: "כניסה",
    register: "הרשם",
    passwordPlaceholder: "סיסמה",
    usernamePlaceholder: "תעודת זהות",
    forgotPassword: "שכחתם סיסמה?",
    notRegistered: "לא רשום?",
    registerHere: "הרשם כאן",
    wrongCredentials: "שם משתמש או סיסמא לא נכונים.",
    pendingApproval: "הבקשה שלך עדיין ממתינה לאישור.",
    pendingApprovalTitle: "ממתין לאישור",
    emailNotVerified: "אימייל לא מאומת. קישור לאימות לא התקבל? נא לפנות לתמיכה",
    emailNotVerifiedTitle: "אימות אימייל נדרש",
    close: "סגור",
  },
};

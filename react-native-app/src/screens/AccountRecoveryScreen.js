import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import BasicScreen from "../components/screenComponents/BasicScreen";
import TextField from "../components/components/TextField";
import MyLanguageContext from "../utils/MyLanguageContext";
import NavButton from "../components/components/NavButton";
import { Alert } from "react-native";
import { CommonActions } from "@react-navigation/native";

export default function AccountRecoveryScreen({ navigation }) {
  const { language } = useContext(MyLanguageContext);
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleRecover = () => {
    console.log("Recovering account with:", { id, phone, email });
  
    Alert.alert(
      language === 'en' ? 'Success' : 'הצלחה',
      text[language].recoveryMessage,
      [
        {
          text: language === 'en' ? 'OK' : 'אישור',
          onPress: () => {
            // Reset navigation stack and navigate to Home
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              })
            );
          },
        },
      ]
    );
  };
  
  const iconPosition = language === 'en' ? 'left' : 'right';

  return (
    <BasicScreen title={text[language].title} language={language}>
      <View style={styles.form}>
        <TextField
          placeholder={text[language].idPlaceholder}
          value={id}
          onChangeText={setId}
          icon="user"
          iconPosition={iconPosition}
          language={language}
        />
        <TextField
          placeholder={text[language].phonePlaceholder}
          value={phone}
          onChangeText={setPhone}
          icon="phone"
          iconPosition={iconPosition}
          language={language}
        />
        <TextField
          placeholder={text[language].emailPlaceholder}
          value={email}
          onChangeText={setEmail}
          icon="letter"
          iconPosition={iconPosition}
          language={language}
        />
        <View style={styles.buttonContainer}>
          <NavButton title={text[language].buttonText} onPress={handleRecover} />
        </View>
      </View>
    </BasicScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },
});

const text = {
    en: {
      title: "Account Recovery",
      idPlaceholder: "Enter your ID",
      phonePlaceholder: "Enter your phone number",
      emailPlaceholder: "Enter your email",
      buttonText: "Recover Password",
      recoveryMessage: "Password has been sent to your email",
    },
    he: {
      title: "שחזור חשבון",
      idPlaceholder: "תעודת זהות",
      phonePlaceholder: "מספר טלפון",
      emailPlaceholder: "אימייל",
      buttonText: "שחזר סיסמא",
      recoveryMessage: "הסיסמה נשלחה לאימייל שלך",
    },
  };

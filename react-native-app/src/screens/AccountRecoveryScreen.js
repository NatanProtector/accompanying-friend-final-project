import React, { useContext, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import BasicScreen from "../components/screenComponents/BasicScreen";
import TextField from "../components/components/TextField";
import MyLanguageContext from "../utils/MyLanguageContext";

export default function AccountRecoveryScreen({ navigation }) {
  const { language } = useContext(MyLanguageContext);
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleRecover = () => {
    console.log("Recovering account with:", { id, phone, email });
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
          <Button title={text[language].buttonText} onPress={handleRecover} color="#4A90E2" />
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
  },
});

const text = {
    en: {
      title: "Account Recovery",
      idPlaceholder: "Enter your ID",
      phonePlaceholder: "Enter your phone number",
      emailPlaceholder: "Enter your email",
      buttonText: "Recover Password",
    },
    he: {
      title: "שחזור חשבון",
      idPlaceholder: "תעודת זהות",
      phonePlaceholder: "מספר טלפון",
      emailPlaceholder: "אימייל",
      buttonText: "שחזר סיסמא",
    },
  };

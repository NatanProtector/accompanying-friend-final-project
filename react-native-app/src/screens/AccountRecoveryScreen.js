import { Formik } from "formik";
import * as Yup from "yup";
import React, { useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import BasicScreen from "../components/screen_components/BasicScreen";
import TextField from "../components/general_components/TextField";
import MyLanguageContext from "../utils/MyLanguageContext";
import NavButton from "../components/general_components/NavButton";
import { sendPasswordResetEmail } from "../utils/emailJS";
import { CommonActions } from "@react-navigation/native";
import { SERVER_URL } from "@env";
import { SubmitAccountRecovery } from "../utils/Communication";

export default function AccountRecoveryScreen({ navigation }) {
  const { language } = useContext(MyLanguageContext);

  const validationSchema = Yup.object().shape({
    id: Yup.string()
      .min(5, text[language].validation.idMin)
      .required(text[language].validation.idRequired),
    phone: Yup.string()
      .matches(/^[0-9]{9,10}$/, text[language].validation.phoneInvalid)
      .required(text[language].validation.phoneRequired),
    email: Yup.string()
      .email(text[language].validation.emailInvalid)
      .required(text[language].validation.emailRequired),
  });

  const iconPosition = language === "en" ? "left" : "right";

  return (
    <BasicScreen title={text[language].title} language={language}>
      <Formik
        initialValues={
          // { id: "", phone: "", email: "" }
          {
            id: "123456789",
            phone: "0501234567",
            email: "natanprotector50@gmail.com",
          }
        }
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const payload = {
            idNumber: values.id,
            phone: values.phone,
            email: values.email,
          };

          const API_URL = `${SERVER_URL}/api/auth/recover-account`;
          try {
            const response = await SubmitAccountRecovery(payload);

            console.log("response", response.data);

            const passwordResetToken = response.passwordResetToken;
            const name = response.name;
            const destination_email = response.email;

            await sendPasswordResetEmail(
              destination_email,
              name,
              passwordResetToken
            );

            Alert.alert(
              text[language].alert.success,
              text[language].alert.recoveryMessage,
              [
                {
                  text: text[language].alert.ok,
                  onPress: () => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: "Home" }],
                      })
                    );
                  },
                },
              ]
            );
          } catch (error) {
            let errorMessage = error.message;
            console.log("Account recovery failed:", error.message);
            Alert.alert(
              text[language].alert.errorTitle || "Error",
              errorMessage,
              [{ text: text[language].alert.ok }]
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <TextField
              placeholder={text[language].idPlaceholder}
              value={values.id}
              onChangeText={handleChange("id")}
              onBlur={handleBlur("id")}
              icon="user"
              iconPosition={iconPosition}
              language={language}
              errorMessage={touched.id && errors.id}
            />
            <TextField
              placeholder={text[language].phonePlaceholder}
              value={values.phone}
              onChangeText={handleChange("phone")}
              onBlur={handleBlur("phone")}
              icon="phone"
              iconPosition={iconPosition}
              language={language}
              errorMessage={touched.phone && errors.phone}
            />
            <TextField
              placeholder={text[language].emailPlaceholder}
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              icon="letter"
              iconPosition={iconPosition}
              language={language}
              errorMessage={touched.email && errors.email}
            />
            <View style={styles.buttonContainer}>
              <NavButton
                title={text[language].buttonText}
                onPress={handleSubmit}
              />
            </View>
          </View>
        )}
      </Formik>
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
    alert: {
      success: "Success",
      recoveryMessage: "Password has been sent to your email",
      ok: "OK",
      errorTitle: "Recovery Failed",
      genericError: "Could not recover password.",
    },
    validation: {
      idMin: "ID must be at least 5 characters",
      idRequired: "ID is required",
      phoneInvalid: "Invalid phone number",
      phoneRequired: "Phone number is required",
      emailInvalid: "Invalid email",
      emailRequired: "Email is required",
    },
  },
  he: {
    title: "שחזור חשבון",
    idPlaceholder: "תעודת זהות",
    phonePlaceholder: "מספר טלפון",
    emailPlaceholder: "אימייל",
    buttonText: "שחזר סיסמא",
    alert: {
      success: "הצלחה",
      recoveryMessage: "הסיסמה נשלחה לאימייל שלך",
      ok: "אישור",
      errorTitle: "שחזור נכשל",
      genericError: "לא ניתן לשחזר סיסמא.",
    },
    validation: {
      idMin: "תעודת הזהות חייבת להכיל לפחות 5 תווים",
      idRequired: "שדה תעודת זהות הוא חובה",
      phoneInvalid: "מספר טלפון לא תקין",
      phoneRequired: "שדה מספר טלפון הוא חובה",
      emailInvalid: "אימייל לא תקין",
      emailRequired: "שדה אימייל הוא חובה",
    },
  },
};

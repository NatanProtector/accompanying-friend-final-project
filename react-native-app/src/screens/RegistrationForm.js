import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  I18nManager,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import BasicScreen from "../components/screen_components/BasicScreen";
import MyLanguageContext from "../utils/MyLanguageContext";
import TextField from "../components/general_components/TextField";
import TextFieldPassword from "../components/general_components/TextFieldPassword";
import NavButton from "../components/general_components/NavButton";
import { CommonActions } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { SubmitRegisterForm } from "../utils/Communication";
import { sendVerificationEmail } from "../utils/emailJS";
import LoadModalController from "../utils/LoadModalController";
import * as FileSystem from "expo-file-system";


export default function RegistrationForm({ route, navigation }) {
  const { language } = useContext(MyLanguageContext);
  const { registerAs } = route.params || {};
  const iconPosition = language === "en" ? "left" : "right";

  const [idPhoto, setIdPhoto] = useState(null);
  const [securityCertificatePhoto, setSecurityCertificatePhoto] =
    useState(null);

  const [showPasswordInfo, setShowPasswordInfo] = useState(true);
  const [showIDInfo, setShowIDInfo] = useState(true);

  // Load Modal Controllers
  const { startLoad, endLoad, LoadModal } = LoadModalController();

  useEffect(() => {
    I18nManager.forceRTL(language === "he");
  }, [language]);

  // Update the Yup Schema with dynamic messages:
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required(validationMessages[language].requiredFullName)
      .matches(
        /^[A-Za-z\u0590-\u05FF]+(?: [A-Za-z\u0590-\u05FF]+)+$/,
        validationMessages[language].invalidFullName
      ),

    idNumber: Yup.string().required(
      validationMessages[language].requiredIdNumber
    ),

    phone: Yup.string().required(validationMessages[language].requiredPhone),

    email: Yup.string()
      .email(validationMessages[language].invalidEmail)
      .required(validationMessages[language].requiredEmail),

    password: Yup.string()
      .required(validationMessages[language].requiredPassword)
      .min(8, validationMessages[language].minPassword)
      .matches(/[A-Z]/, validationMessages[language].upperCase)
      .matches(/[a-z]/, validationMessages[language].lowerCase)
      .matches(/\d/, validationMessages[language].number)
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        validationMessages[language].specialChar
      ),

    // For testing removed
    idPhoto: Yup.string().required(
      validationMessages[language].requiredIdPhoto
    ),

    securityCertificatePhoto:
      registerAs === "security" || registerAs === "both"
        ? Yup.string().required(
          validationMessages[language].requiredCertificate
        )
        : Yup.string().nullable(),
  });

  // Image picker logic
  const pickImage = async (setPhoto, setFieldValue, fieldName) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];

      // 🔍 Check file size (in bytes), limit is 2MB = 2 * 1024 * 1024
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      // if (fileInfo.size > 2 * 1024 * 1024) {
      //   Alert.alert("File too large", "Please choose an image under 2MB.");
      //   return;
      // }

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64Uri = `data:image/jpeg;base64,${base64}`;

      setPhoto(base64Uri); // update state for preview
      setFieldValue(fieldName, base64Uri); // update Formik field
    } else {
      console.log("No image selected");
    }
  };


  const handleFormSubmit = async (values) => {
    startLoad();
    try {
      values.registerAs = registerAs;

      if (registerAs === "both") {
        values.multiRole = ["citizen", "security"];
      } else {
        values.multiRole = [registerAs];
      }

      const response = await SubmitRegisterForm(values);

      if (response) {
        try {
          const token = response.verificationToken;

          await sendVerificationEmail(values.email, values.fullName, token);
        } catch (error) {
          Alert.alert(
            RegistrationText[language].failureTitleEmail,
            RegistrationText[language].failureMessageEmail,
            [{ text: RegistrationText[language].okButtonEmail }]
          );
          console.log("Error sending verification email:", `Status: ${error.status}`, `${error.text}`);
        }
      }

      Alert.alert(
        RegistrationText[language].successTitle,
        RegistrationText[language].successMessage,
        [
          {
            text: RegistrationText[language].okButton,
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })
              );
            },
          },
        ]
      );
    } catch (error) {
      console.log("Form submission failed:", error.message);
      // show an error later
      Alert.alert(
        RegistrationText[language].failureTitle,
        RegistrationText[language].failureMessage,
        [{ text: RegistrationText[language].okButton }]
      );
    } finally {
      endLoad();
    }
  };

  return (
    <BasicScreen title={RegistrationText[language].title} language={language}>
      <LoadModal />
      <Formik
        initialValues={{
          fullName: "",
          idNumber: "",
          phone: "",
          email: "",
          password: "",
          idPhoto: "",
          securityCertificatePhoto: "",
          // fullName: '',
          // idNumber: '',
          // phone: '',
          // email: '',
          // password: '',
          // idPhoto: '',
          // securityCertificatePhoto: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          handleChange,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <TextField
              icon="user"
              placeholder={RegistrationText[language].fullName}
              value={values.fullName}
              onChangeText={handleChange("fullName")}
              language={language}
              iconPosition={iconPosition}
              errorMessage={touched.fullName && errors.fullName}
            />

            <TextField
              icon="user"
              placeholder={RegistrationText[language].idNumber}
              value={values.idNumber}
              onChangeText={handleChange("idNumber")}
              keyboardType="numeric"
              language={language}
              iconPosition={iconPosition}
              onFocus={() => setShowIDInfo(false)}
              errorMessage={touched.idNumber && errors.idNumber}
            />

            {showIDInfo && (
              <Text style={styles.passwordInfo}>
                {RegistrationText[language].IDInfo}
              </Text>
            )}

            <TextField
              icon="phone"
              placeholder={RegistrationText[language].phone}
              value={values.phone}
              onChangeText={handleChange("phone")}
              keyboardType="phone-pad"
              language={language}
              iconPosition={iconPosition}
              errorMessage={touched.phone && errors.phone}
            />

            <TextField
              icon="letter"
              placeholder={RegistrationText[language].email}
              value={values.email}
              onChangeText={handleChange("email")}
              keyboardType="email-address"
              language={language}
              iconPosition={iconPosition}
              errorMessage={touched.email && errors.email}
            />

            <TextFieldPassword
              placeholder={RegistrationText[language].password}
              value={values.password}
              onChangeText={handleChange("password")}
              iconPosition={iconPosition}
              language={language}
              onFocus={() => setShowPasswordInfo(false)}
              errorMessage={touched.password && errors.password}
            />

            {showPasswordInfo && (
              <Text style={styles.passwordInfo}>
                {RegistrationText[language].passwordInfo}
              </Text>
            )}

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={async () => {
                await pickImage(setIdPhoto, setFieldValue, "idPhoto");
              }}

            >
              <Text style={styles.uploadButtonText}>
                {idPhoto
                  ? RegistrationText[language].uploadedID
                  : RegistrationText[language].uploadID}
              </Text>
            </TouchableOpacity>
            {idPhoto && (
              <Image source={{ uri: idPhoto }} style={styles.image} />
            )}
            {touched.idPhoto && errors.idPhoto && (
              <Text style={styles.error}>{errors.idPhoto}</Text>
            )}

            {(registerAs === "security" || registerAs === "both") && (
              <>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={async () => {
                    await pickImage((uri) => {
                      setSecurityCertificatePhoto(uri);
                      setFieldValue("securityCertificatePhoto", uri);
                    });
                  }}
                >
                  <Text style={styles.uploadButtonText}>
                    {securityCertificatePhoto
                      ? RegistrationText[language].uploadedCertificate
                      : RegistrationText[language].uploadCertificate}
                  </Text>
                </TouchableOpacity>
                {securityCertificatePhoto && (
                  <Image
                    source={{ uri: securityCertificatePhoto }}
                    style={styles.image}
                  />
                )}
                {touched.securityCertificatePhoto &&
                  errors.securityCertificatePhoto && (
                    <Text style={styles.error}>
                      {errors.securityCertificatePhoto}
                    </Text>
                  )}
              </>
            )}

            <NavButton
              title={RegistrationText[language].submit}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </BasicScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#4958FF",
    width: 200,
    height: 40,
    fontSize: 16,
    margin: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    alignSelf: "center",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  passwordInfo: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "left",
    width: "90%",
  },
});

const RegistrationText = {
  en: {
    IDInfo: "ID number will be used as the username",
    title: "Registration",
    fullName: "Full name",
    idNumber: "ID Number",
    phone: "Phone",
    email: "Email",
    uploadID: "Upload ID Photo",
    uploadedID: "ID Photo Uploaded",
    uploadCertificate: "Upload Security Certificate",
    uploadedCertificate: "Certificate Uploaded",
    submit: "Submit",
    password: "Password",
    successTitle: "Success",
    successMessage: "Registration successful",
    okButton: "OK",
    passwordInfo:
      "Password must be at least 8 characters long, contain an uppercase letter, lowercase letter, a number, and a special character.",
    failureTitle: "Error",
    failureMessage: "Registration failed. Please try again.",
    failureButtonEmail: "OK",
    failureTitleEmail: "Error",
    failureMessageEmail: "Error sending verification email, contact support at natanprotector@gmail.com",
    okButtonEmail: "OK",
  },
  he: {
    IDInfo: "מספר תעודת זהות ישמש כשם המשתמש",
    title: "הרשמה",
    fullName: "שם מלא",
    idNumber: "מספר תעודת זהות",
    phone: "טלפון",
    email: "אימייל",
    uploadID: "העלה תעודת זהות",
    uploadedID: "תעודת זהות הועלתה",
    uploadCertificate: "העלה תעודת מאבטח",
    uploadedCertificate: "תעודת מאבטח הועלתה",
    submit: "שלח",
    password: "סיסמה",
    successTitle: "הצלחה",
    successMessage: "הרשמה בוצעה בהצלחה",
    okButton: "אישור",
    passwordInfo:
      "הסיסמה חייבת להכיל לפחות 8 תווים, להכיל אותיות גדולות, אותיות קטנות, מספרים ותווים מיוחדים.",
    failureTitle: "שגיאה",
    failureMessage: "ההרשמה נכשלה. אנא נסה שוב.",
    failureButtonEmail: "אישור",
    failureTitleEmail: "שגיאה",
    failureMessageEmail: "שגיאה בשליחת מייל בדיקה, צרו קשר עם תמיכה טכנית: natanprotector@gmail.com",
    okButtonEmail: "אישור",
  },
};

const validationMessages = {
  en: {
    requiredFullName: "Full name is required",
    invalidFullName:
      "Enter a valid full name with letters only and at least two words",
    requiredIdNumber: "ID number is required",
    requiredPhone: "Phone number is required",
    invalidEmail: "Invalid email",
    requiredEmail: "Email is required",
    requiredPassword: "Password is required",
    minPassword: "Minimum 8 characters",
    invalidPassword: "English letters and symbols only",
    upperCase: "Must contain at least one uppercase letter",
    lowerCase: "Must contain at least one lowercase letter",
    number: "Must contain at least one number",
    specialChar: "Must contain at least one special character",
    requiredIdPhoto: "ID Photo is required",
    requiredCertificate: "Certificate is required",
  },
  he: {
    requiredFullName: "נדרש שם מלא",
    invalidFullName: "הזן שם מלא תקין עם אותיות בלבד ולפחות שתי מילים",
    requiredIdNumber: "נדרש מספר תעודת זהות",
    requiredPhone: "נדרש מספר טלפון",
    invalidEmail: "אימייל לא תקין",
    requiredEmail: "נדרש אימייל",
    requiredPassword: "נדרשת סיסמה",
    minPassword: "מינימום 8 תווים",
    invalidPassword: "רק אותיות באנגלית ותווים מיוחדים",
    upperCase: "חייב להכיל לפחות אות גדולה אחת",
    lowerCase: "חייב להכיל לפחות אות קטנה אחת",
    number: "חייב להכיל לפחות מספר אחד",
    specialChar: "חייב להכיל לפחות תו מיוחד אחד",
    requiredIdPhoto: "נדרש להעלות תמונת תעודת זהות",
    requiredCertificate: "נדרש להעלות תעודת מאבטח",
  },
};

import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Image, I18nManager } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BasicScreen from '../components/screenComponents/BasicScreen';
import MyLanguageContext from '../utils/MyLanguageContext';
import TextField from '../components/components/TextField';
import TextFieldPassword from '../components/components/TextFieldPassword';
import NavButton from '../components/components/NavButton';
import { CommonActions } from "@react-navigation/native";
import { Formik } from 'formik';
import * as Yup from 'yup';
import {SubmitRegisterForm} from '../utils/Communication';

export default function RegistrationForm({ route, navigation }) {
  const { language } = useContext(MyLanguageContext);
  const { registerAs } = route.params || {};
  const iconPosition = language === 'en' ? 'left' : 'right';

  const [idPhoto, setIdPhoto] = useState(null);
  const [securityCertificatePhoto, setSecurityCertificatePhoto] = useState(null);

  const [showPasswordInfo, setShowPasswordInfo] = useState(true);

  useEffect(() => {
    I18nManager.forceRTL(language === 'he');
  }, [language]);

  // Update the Yup Schema with dynamic messages:
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required(validationMessages[language].requiredFullName)
      .matches(/^[A-Za-z\u0590-\u05FF]+(?: [A-Za-z\u0590-\u05FF]+)+$/, validationMessages[language].invalidFullName),

    idNumber: Yup.string()
      .required(validationMessages[language].requiredIdNumber),

    phone: Yup.string()
      .required(validationMessages[language].requiredPhone),

    email: Yup.string()
      .email(validationMessages[language].invalidEmail)
      .required(validationMessages[language].requiredEmail),

    password: Yup.string()
      .required(validationMessages[language].requiredPassword)
      .min(8, validationMessages[language].minPassword)
      .matches(/^[A-Za-z0-9!@#$%^&*()_+=\-[\]{}|:;"'<>,.?/]+$/, validationMessages[language].invalidPassword)
      .matches(/[A-Z]/, validationMessages[language].upperCase)
      .matches(/[a-z]/, validationMessages[language].lowerCase)
      .matches(/\d/, validationMessages[language].number)
      .matches(/[!@#$%^&*(),.?":{}|<>]/, validationMessages[language].specialChar),

    // For testing removed  
    idPhoto: Yup.string()
      .required(validationMessages[language].requiredIdPhoto),

    securityCertificatePhoto: registerAs === 'security' 
      ? Yup.string().required(validationMessages[language].requiredCertificate)
      : Yup.string().nullable(),
  });

  // Image picker logic
  const pickImage = async (setPhoto) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    } else {
      console.log('No image selected');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await SubmitRegisterForm(values);
  
      // Only alert if submit succeeds
      Alert.alert(
        RegistrationText[language].successTitle,
        RegistrationText[language].successMessage,
        [
          {
            text: RegistrationText[language].okButton,
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] })
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error('Form submission failed:', error);
      // show an error later
    }
  };
  

  return (
    <BasicScreen title={RegistrationText[language].title} language={language}>
      <Formik
        initialValues={{
          fullName: '',
          idNumber: '',
          phone: '',
          email: '',
          password: '',
          idPhoto: '',
          securityCertificatePhoto: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.container}>
            <TextField
              icon="user"
              placeholder={RegistrationText[language].fullName}
              value={values.fullName}
              onChangeText={handleChange('fullName')}
              language={language}
              iconPosition={iconPosition}
              errorMessage = {touched.fullName && errors.fullName}
            />

            <TextField
              icon="user"
              placeholder={RegistrationText[language].idNumber}
              value={values.idNumber}
              onChangeText={handleChange('idNumber')}
              keyboardType="numeric"
              language={language}
              iconPosition={iconPosition}
              errorMessage = {touched.idNumber && errors.idNumber}
            />

            <TextField
              icon="phone"
              placeholder={RegistrationText[language].phone}
              value={values.phone}
              onChangeText={handleChange('phone')}
              keyboardType="phone-pad"
              language={language}
              iconPosition={iconPosition}
              errorMessage = {touched.phone && errors.phone}
            />

            <TextField
              icon="letter"
              placeholder={RegistrationText[language].email}
              value={values.email}
              onChangeText={handleChange('email')}
              keyboardType="email-address"
              language={language}
              iconPosition={iconPosition}
              errorMessage = {touched.email && errors.email}
            />

            <TextFieldPassword
              placeholder={RegistrationText[language].password}
              value={values.password}
              onChangeText={handleChange('password')}
              iconPosition={iconPosition}
              language={language}
              onFocus={() => setShowPasswordInfo(false)}
              errorMessage = {touched.password && errors.password}
            />

            {showPasswordInfo && (
              <Text style={styles.passwordInfo}>
                {language === 'he'
                  ? RegistrationText[language].passwordInfo
                  : RegistrationText[language].passwordInfo}
              </Text>
            )}

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={async () => {
                await pickImage((uri) => {
                  setIdPhoto(uri);
                  setFieldValue('idPhoto', uri);
                });
              }}
            >
              <Text style={styles.uploadButtonText}>
                {idPhoto ? RegistrationText[language].uploadedID : RegistrationText[language].uploadID}
              </Text>
            </TouchableOpacity>
            {idPhoto && <Image source={{ uri: idPhoto }} style={styles.image} />}
            {touched.idPhoto && errors.idPhoto && <Text style={styles.error}>{errors.idPhoto}</Text>}

            {registerAs === 'security' && (
              <>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={async () => {
                    await pickImage((uri) => {
                      setSecurityCertificatePhoto(uri);
                      setFieldValue('securityCertificatePhoto', uri);
                    });
                  }}
                >
                  <Text style={styles.uploadButtonText}>
                    {securityCertificatePhoto ? RegistrationText[language].uploadedCertificate : RegistrationText[language].uploadCertificate}
                  </Text>
                </TouchableOpacity>
                {securityCertificatePhoto && <Image source={{ uri: securityCertificatePhoto }} style={styles.image} />}
                {touched.securityCertificatePhoto && errors.securityCertificatePhoto && (
                  <Text style={styles.error}>{errors.securityCertificatePhoto}</Text>
                )}
              </>
            )}

            <NavButton title={RegistrationText[language].submit} onPress={handleSubmit} />
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#4958FF',
    width: 200,
    height: 40,
    fontSize: 16,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
    alignSelf: 'center',
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
  passwordInfo: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'left',
    width: '90%',
  },
  
});

const RegistrationText = {
  en: {
    title: 'Registration',
    fullName: 'Full name',
    idNumber: 'ID Number',
    phone: 'Phone',
    email: 'Email',
    uploadID: 'Upload ID Photo',
    uploadedID: 'ID Photo Uploaded',
    uploadCertificate: 'Upload Security Certificate',
    uploadedCertificate: 'Certificate Uploaded',
    submit: 'Submit',
    password: 'Password',
    successTitle: 'Success',
    successMessage: 'Registration successful',
    okButton: 'OK',
    passwordInfo: 'Password must be at least 8 characters long, contain an uppercase letter, lowercase letter, a number, and a special character.'
  },
  he: {
    title: 'הרשמה',
    fullName: 'שם מלא',
    idNumber: 'תעודת זהות',
    phone: 'טלפון',
    email: 'אימייל',
    uploadID: 'העלה תעודת זהות',
    uploadedID: 'תעודת זהות הועלתה',
    uploadCertificate: 'העלה אישור אבטחה',
    uploadedCertificate: 'אישור הועלה',
    submit: 'שלח',
    password: 'סיסמה',
    successTitle: 'הצלחה',
    successMessage: 'הרשמה בוצעה בהצלחה',
    okButton: 'אישור',
    passwordInfo: 'הסיסמה חייבת להכיל לפחות 8 תווים, להכיל אותיות גדולות, אותיות קטנות, מספרים ותווים מיוחדים.'
  },
};

const validationMessages = {
  en: {
    requiredFullName: 'Full name is required',
    invalidFullName: 'Enter a valid full name with letters only and at least two words',
    requiredIdNumber: 'ID number is required',
    requiredPhone: 'Phone number is required',
    invalidEmail: 'Invalid email',
    requiredEmail: 'Email is required',
    requiredPassword: 'Password is required',
    minPassword: 'Minimum 8 characters',
    invalidPassword: 'English letters and symbols only',
    upperCase: 'Must contain at least one uppercase letter',
    lowerCase: 'Must contain at least one lowercase letter',
    number: 'Must contain at least one number',
    specialChar: 'Must contain at least one special character',
    requiredIdPhoto: 'ID Photo is required',
    requiredCertificate: 'Certificate is required',
  },
  he: {
    requiredFullName: 'נדרש שם מלא',
    invalidFullName: 'הזן שם מלא תקין עם אותיות בלבד ולפחות שתי מילים',
    requiredIdNumber: 'נדרש מספר תעודת זהות',
    requiredPhone: 'נדרש מספר טלפון',
    invalidEmail: 'אימייל לא תקין',
    requiredEmail: 'נדרש אימייל',
    requiredPassword: 'נדרשת סיסמה',
    minPassword: 'מינימום 8 תווים',
    invalidPassword: 'רק אותיות באנגלית ותווים מיוחדים',
    upperCase: 'חייב להכיל לפחות אות גדולה אחת',
    lowerCase: 'חייב להכיל לפחות אות קטנה אחת',
    number: 'חייב להכיל לפחות מספר אחד',
    specialChar: 'חייב להכיל לפחות תו מיוחד אחד',
    requiredIdPhoto: 'נדרש להעלות תמונת תעודת זהות',
    requiredCertificate: 'נדרש להעלות אישור אבטחה',
  }
};

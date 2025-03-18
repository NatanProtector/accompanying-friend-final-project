import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Image, I18nManager } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import BasicScreen from '../components/screenComponents/BasicScreen';
import MyLanguageContext from '../utils/MyLanguageContext';

import TextField from '../components/components/TextField';
import TextFieldPassword from '../components/components/TextFieldPassword';

import NavButton from '../components/components/NavButton';

import { CommonActions } from "@react-navigation/native";


export default function RegistrationForm({ route, navigation }) {
  const { language } = useContext(MyLanguageContext);
  const { registerAs } = route.params || {};

    // Set icon alignment based on language
    const iconPosition = language === 'en' ? 'left' : 'right';


  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idPhoto, setIdPhoto] = useState(null);
  const [securityCertificatePhoto, setSecurityCertificatePhoto] = useState(null);
  const [idNumber, setIdNumber] = useState('');

  useEffect(() => {
    I18nManager.forceRTL(language === 'he');
  }, [language]);

  const handleUploadPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access media library is required!');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled && result.assets.length > 0) {
      setIdPhoto(result.assets[0].uri);
    } else {
      console.log('No image selected');
    }
  };

  const handleUploadSecurityCertificate = async () => {
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
      setSecurityCertificatePhoto(result.assets[0].uri);
    } else {
      console.log('No image selected');
    }
  };

  const handleFormSubmit = () => {
    Alert.alert(
      RegistrationText[language].successTitle,
      RegistrationText[language].successMessage,
      [
        {
          text: RegistrationText[language].okButton,
          onPress: () => {
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
  

  return (
    <BasicScreen title={RegistrationText[language].title} language={language}>
      <View style={styles.container}>
        <TextField
          icon="user"    
          placeholder={RegistrationText[language].fullName}
          value={fullName}
          onChangeText={setFullName}
          language={language}
          iconPosition={iconPosition}
        />
        <TextField
          icon="user"
          placeholder={RegistrationText[language].idNumber}
          value={idNumber}
          onChangeText={setIdNumber}
          keyboardType="numeric"
          language={language}
          iconPosition={iconPosition}
        />
        <TextField
          icon="phone"
          placeholder={RegistrationText[language].phone}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          language={language}
          iconPosition={iconPosition}
        />
        <TextField
          icon="letter"
          placeholder={RegistrationText[language].email}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          language={language}
          iconPosition={iconPosition}
        />

        <TextFieldPassword
          placeholder={RegistrationText[language].password}
          value={password}
          onChangeText={setPassword}
          iconPosition={iconPosition}
          language={language}
        />
        
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
          <Text style={styles.uploadButtonText}>
            {idPhoto ? RegistrationText[language].uploadedID : RegistrationText[language].uploadID}
          </Text>
        </TouchableOpacity>


        {idPhoto && <Image source={{ uri: idPhoto }} style={styles.image} />}

        {registerAs === 'security' && (
          <>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadSecurityCertificate}>
              <Text style={styles.uploadButtonText}>
                {securityCertificatePhoto ? RegistrationText[language].uploadedCertificate : RegistrationText[language].uploadCertificate}
              </Text>
            </TouchableOpacity>
            {securityCertificatePhoto && <Image source={{ uri: securityCertificatePhoto }} style={styles.image} />}
          </>
        )}

        <NavButton title={RegistrationText[language].submit} onPress={handleFormSubmit} />

      </View>
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
  },
};

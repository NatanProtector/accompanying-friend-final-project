import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, Image, I18nManager } from 'react-native';
import { Card, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { RegistrationFormText } from '../constants/text';
import MyLanguageContext from '../utils/MyLanguageContext';

export default function RegistrationForm({ route }) {

  const { language } = useContext(MyLanguageContext);
  const { registerAs } = route.params || {}; // Get the register type (citizen/security)

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idPhoto, setIdPhoto] = useState(null);
  const [securityCertificatePhoto, setSecurityCertificatePhoto] = useState(null);
  const [idNumber, setIdNumber] = useState('');

  const validateForm = (language) => {
    const messages = {
      firstName: {
        en: 'First name must be at least 2 characters.',
        he: 'שם פרטי חייב להיות לפחות 2 תווים.',
      },
      lastName: {
        en: 'Last name must be at least 2 characters.',
        he: 'שם משפחה חייב להיות לפחות 2 תווים.',
      },
      phone: {
        en: 'Phone number must be exactly 10 digits.',
        he: 'מספר הטלפון חייב להיות בדיוק 10 ספרות.',
      },
      idNumber: {
        en: 'ID number must be exactly 9 digits.',
        he: 'מספר תעודת הזהות חייב להיות בדיוק 9 ספרות.',
      },
      email: {
        en: 'Invalid email address.',
        he: 'כתובת האימייל אינה תקינה.',
      },
      idPhoto: {
        en: 'ID photo is required.',
        he: 'תמונת תעודת זהות נדרשת.',
      },
      securityCertificate: {
        en: 'Security certificate photo is required.',
        he: 'תמונת תעודת ביטחון נדרשת.',
      },
    };
  
    if (!firstName || firstName.length < 2 || firstName.length > 15) {
      return messages.firstName[language === 'en' ? 'en' : 'he'];
    }
    if (!lastName || lastName.length < 2 || lastName.length > 15) {
      return messages.lastName[language === 'en' ? 'en' : 'he'];
    }
    if (!phone || phone.length !== 10 || !(/^\d+$/.test(phone))) {
      return messages.phone[language === 'en' ? 'en' : 'he'];
    }
    if (!idNumber || idNumber.length !== 9 || !(/^\d+$/.test(idNumber))) {
      return messages.idNumber[language === 'en' ? 'en' : 'he'];
    }
    if (!email || !email.includes('@')) {
      return messages.email[language === 'en' ? 'en' : 'he'];
    }
    if (!idPhoto) {
      return messages.idPhoto[language === 'en' ? 'en' : 'he'];
    }
    if (registerAs === 'security' && !securityCertificatePhoto) {
      return messages.securityCertificate[language === 'en' ? 'en' : 'he'];
    }
    return null;
  };
  

  const handleUploadPhoto = async () => {
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
      setIdPhoto(result.uri);
      Alert.alert(RegistrationFormText[language].idPhotoConfirmation);
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
      setSecurityCertificatePhoto(result.uri);
      Alert.alert(RegistrationFormText[language].securityCertificateConfirmation);
    } else {
      console.log('No image selected');
    }
  };

  const handleSubmit = () => {
    const formData = {
      firstName,
      lastName,
      email,
      phone,
      idNumber,
      idPhoto,
      securityCertificatePhoto, // Add this field
    };

    const error = validateForm(language);

    if (error) {
      Alert.alert(language === 'en' ? 'Validation Error' : 'שגיאת אימות', error);
      return;
    }

    console.log('Validated form data:', formData);

    // TODO: Add functionality to send data to the backend
  };

  useEffect(() => {
    I18nManager.forceRTL(language === 'he');
  }, [language]);

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>{RegistrationFormText[language].title}</Text>
        <TextInput
          style={styles.input}
          placeholder={RegistrationFormText[language].firstName}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder={RegistrationFormText[language].lastName}
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder={RegistrationFormText[language].phone}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder={RegistrationFormText[language].idNumber}
          keyboardType="numeric"
          value={idNumber}
          onChangeText={setIdNumber}
        />
        <TextInput
          style={styles.input}
          placeholder={RegistrationFormText[language].email}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
          <Text style={styles.uploadButtonText}>
            {idPhoto ? RegistrationFormText[language].idPhotoConfirmation : RegistrationFormText[language].isPhotoInvalid}
          </Text>
        </TouchableOpacity>

        {idPhoto && (
          <Image source={{ uri: idPhoto }} style={{ width: 100, height: 100, marginBottom: 16 }} />
        )}

        {registerAs === 'security' && (
          <>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadSecurityCertificate}>
              <Text style={styles.uploadButtonText}>
                {securityCertificatePhoto ? RegistrationFormText[language].securityCertificateConfirmation : RegistrationFormText[language].isSecurityCertificateInvalid}
              </Text>
            </TouchableOpacity>

            {securityCertificatePhoto && (
              <Image source={{ uri: securityCertificatePhoto }} style={{ width: 100, height: 100, marginBottom: 16 }} />
            )}
          </>
        )}

        <Button title={RegistrationFormText[language].submit} onPress={handleSubmit} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

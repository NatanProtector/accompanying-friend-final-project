import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, Image, Linking, I18nManager } from 'react-native';
import { Card, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { RegistrationFormText } from '../constants/text';
import MyLanguageContext from '../utils/MyLanguageContext';
import axios from 'axios';

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

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'denied') {
            Alert.alert(
                'Permission Denied',
                'You need to enable media library access in your device settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
        }
        return status === 'granted';
    };

    const handleUploadPhoto = async (setPhoto) => {
      console.log('Upload button pressed'); // Debugging log

      try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          console.log(`Permission status: ${status}`); // Debugging log

          if (status !== 'granted') {
              Alert.alert(
                  'Permission Denied',
                  'You need to enable media library access in your device settings.',
                  [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Open Settings', onPress: () => Linking.openSettings() },
                  ]
              );
              return;
          }

          console.log('Opening image picker...');
          const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
          });

          console.log('Image picker result:', result); // Debugging log

          if (!result.canceled && result.assets && result.assets[0]?.uri) {
              console.log('Photo selected:', result.assets[0].uri); // Debugging log
              setPhoto(result.assets[0].uri); // Dynamically set the photo
              Alert.alert('Photo selected successfully!');
          } else {
              Alert.alert('No photo selected!');
          }
      } catch (error) {
          console.error('Error in photo upload:', error);
          Alert.alert('Error', 'An error occurred while trying to upload the photo.');
      }
  };

  const handleSubmit = async () => {
    const formData = {
        firstName,
        lastName,
        email,
        phone,
        idNumber,
        idPhoto,
        multiRole: registerAs === 'security' ? ['security'] : ['citizen'], // Add role dynamically
    };

    if (registerAs === 'security' && securityCertificatePhoto) {
        formData.securityCertificatePhoto = securityCertificatePhoto;
    }

    console.log('Form data to be sent:', formData); // Debugging log

    const error = validateForm(language);
    if (error) {
        Alert.alert(language === 'en' ? 'Validation Error' : 'שגיאת אימות', error);
        return;
    }


        try {
            const response = await axios.post('http://localhost:3001/api/auth/register', formData);
            if (response.status === 201) {
                Alert.alert(
                    language === 'en' ? 'Registration Successful' : 'הרשמה הצליחה',
                    language === 'en' ? 'Your details have been submitted!' : 'הפרטים נשלחו בהצלחה!'
                );
            } else {
                Alert.alert(language === 'en' ? 'Error' : 'שגיאה', 'Something went wrong!');
            }
        } catch (err) {
            console.error(err);
            Alert.alert(language === 'en' ? 'Error' : 'שגיאה', 'Failed to submit the form.');
        }
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

                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => handleUploadPhoto(setIdPhoto)}
                >
                    <Text style={styles.uploadButtonText}>
                        {idPhoto ? 'Photo Selected' : 'Upload ID Photo'}
                    </Text>
                </TouchableOpacity>

                {idPhoto && (
                    <Image source={{ uri: idPhoto }} style={{ width: 100, height: 100, marginBottom: 16 }} />
                )}

                {registerAs === 'security' && (
                    <>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => handleUploadPhoto(setSecurityCertificatePhoto)}
                        >
                            <Text style={styles.uploadButtonText}>
                                {securityCertificatePhoto ? 'Security Certificate Uploaded' : 'Upload Security Certificate'}
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

import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, Image, I18nManager } from 'react-native';
import { Card, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';

import BasicScreen from '../components/screenComponents/BasicScreen';
import MyLanguageContext from '../utils/MyLanguageContext';
import defineTextAlignStyle from '../utils/defineTextAlignStyle';

export default function RegistrationForm({ route }) {
  const { language } = useContext(MyLanguageContext);
  const { registerAs } = route.params || {};

  const input_style = defineTextAlignStyle(language, styles.input);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
    } else {
      console.log('No image selected');
    }
  };

  return (
    <BasicScreen title="Registration" language={language}>
      <View style={styles.container}>
        <Card>
          <Text style={styles.title}>Register</Text>
          <TextInput style={input_style} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          <TextInput style={input_style} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          <TextInput style={input_style} placeholder="Phone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <TextInput style={input_style} placeholder="ID Number" keyboardType="numeric" value={idNumber} onChangeText={setIdNumber} />
          <TextInput style={input_style} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
            <Text style={styles.uploadButtonText}>{idPhoto ? "ID Photo Uploaded" : "Upload ID Photo"}</Text>
          </TouchableOpacity>

          {idPhoto && <Image source={{ uri: idPhoto }} style={styles.image} />}

          {registerAs === 'security' && (
            <>
              <TouchableOpacity style={styles.uploadButton} onPress={handleUploadSecurityCertificate}>
                <Text style={styles.uploadButtonText}>{securityCertificatePhoto ? "Certificate Uploaded" : "Upload Security Certificate"}</Text>
              </TouchableOpacity>
              {securityCertificatePhoto && <Image source={{ uri: securityCertificatePhoto }} style={styles.image} />}
            </>
          )}

          <Button title="Submit" onPress={() => Alert.alert('Form submitted!')} />
        </Card>
      </View>
    </BasicScreen>
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
    alignItems: 'center',
    marginBottom: 10,
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
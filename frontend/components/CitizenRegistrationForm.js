import React , {useState} from 'react';
import{View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    I18nManager,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CitizenRegistrationForm() { 
    const [language, setLanguage] = useState('en');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [idPhoto, setIdPhoto] = useState(null);
    const [idNumber, setIdNumber] = useState('');

    const placeholders ={
        en: {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone Number',
            idNumber: 'ID Number',
        },
        he: {
            firstName: 'שם פרטי',
            lastName: 'שם משפחה',
            email: 'אימייל',
            phone: 'מספר טלפון',
            idNumber: 'מספר תעודת זהות',
        },
    };

const validateForm = () => {
    if (!firstName || firstName.length < 2 || firstName.length > 15) return 'First name must be at least 2 characters.';
    if (!lastName || lastName.length < 2 || lastName.length > 15) return 'Last name must be at least 2 characters.';
    if (!phone || phone.length !== 10 || !(/^\d+$/.test(phone))) return 'Phone number must be exactly 10 digits.';
    if (!idNumber || idNumber.length !== 9 || !(/^\d+$/.test(idNumber))) return 'ID number must be exactly 9 digits.';
    if (!email || !email.includes('@')) return 'Invalid email address.';
    if (!idPhoto) return 'ID photo is required.';
    return null;
};

const handleUploadPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted){
        Alert.alert('Permission required', 'Permission to access media library is required!');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
    });

    if (!result.cancelled){
        setIdPhoto(result.uri);
        Alert.alert( language === 'en' ? 'Success' : 'הצלחה',language === 'en' ? 'ID photo uploaded successfully!' : 'התמונה הועלתה בהצלחה!');
    }
};

const handleSubmit = () => {
    const error = validateForm();
    if (error) {
        Alert.alert(language === 'en' ? 'Validation Error' : 'שגיאת אימות', error);
        return;
    }

    const formData = {
        firstName,
        lastName,
        email,
        phone,
        idNumber,
        idPhoto,
    };

    console.log('Vaildated form data:', formData);
    Alert.alert(
      language === 'en' ? 'Registration Successful' : 'הרשמה הצליחה',
      language === 'en' ? 'Your details have been submitted!' : 'הפרטים נשלחו בהצלחה!'
    );

    // TODO: Add functionality to send data to the backend
};

const switchLanguage = (lang) => {
    setLanguage(lang);
    I18nManager.forceRTL(lang === 'he');
};

return(
    <View style={styles.container}>
      <View style={styles.languageSwitcher}>
        <Button title="English" onPress={() => switchLanguage('en')} />
        <Button title="עברית" onPress={() => switchLanguage('he')} />
      </View>
      <Text style={styles.title}>{language === 'en' ? 'Citizen Registration' : 'הרשמת אזרחים'}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholders[language].firstName}
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholders[language].lastName}
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholders[language].phone}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholders[language].idNumber}
        keyboardType="numeric"
        value={idNumber}
        onChangeText={setIdNumber}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholders[language].email}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
        <Text style={styles.uploadButtonText}>
          {idPhoto
            ? language === 'en'
              ? 'ID Photo Uploaded'
              : 'התמונה הועלתה'
            : language === 'en'
            ? 'Upload ID Photo'
            : 'העלה תמונת תעודה'}
        </Text>
      </TouchableOpacity>
      <Button title={language === 'en' ? 'Register' : 'הרשם'} onPress={handleSubmit} />
    </View>
  );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    languageSwitcher: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
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
      textAlign: I18nManager.isRTL ? 'right' : 'left', // Align input based on language
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
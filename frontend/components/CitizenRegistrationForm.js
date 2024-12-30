import React , {useState} from 'react';
import{View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    I18nManager,
} form 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Joi from 'joi';

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

    const schema = Joi.object({
        firstName: Joi.string().min(2).max(15).required(),
        lastName: Joi.string().min(2).max(20).required(),
        phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(10).required(),
        idNumber: Joi.string().length(9).pattern(/^[0-9]+$/).required(),
        email: Joi.string().email().required(),
        idPhoto: Joi.string().required(),
});

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



}
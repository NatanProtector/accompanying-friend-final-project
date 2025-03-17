import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useContext, useState } from 'react';
import MyLanguageContext from '../utils/MyLanguageContext';
import BasicScreen from '../components/screenComponents/BasicScreen';
import NavButton from '../components/components/NavButton';
import TextFieldPassword from '../components/components/TextFieldPassword';
import TextFieldUsername from '../components/components/TextFieldUsername';

export default function HomeScreen({ navigation }) {    
    const { language } = useContext(MyLanguageContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Set icon alignment based on language
    const iconPosition = language === 'en' ? 'left' : 'right';

    const handleLogin = () => {
        if (username == '' && password == '') {
            navigation.navigate('Login');
        }
    };

    return (
        <BasicScreen title={HomeText[language].title} subtitle={HomeText[language].subtitle}>
            <View style={style.container}>
                <View style={style.inputContainer}>
                    <TextFieldUsername
                        placeholder={HomeText[language].usernamePlaceholder}
                        iconPosition={iconPosition}
                        language={language}
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextFieldPassword
                        placeholder={HomeText[language].passwordPlaceholder}
                        iconPosition={iconPosition}
                        language={language}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity onPress={() => console.log('Forgot password clicked')}>
                        <Text style={style.forgotPassword}>{HomeText[language].forgotPassword}</Text>
                    </TouchableOpacity>
                </View>
                
                <NavButton
                    title={HomeText[language].login}
                    onPress={handleLogin}
                />
                
                <View style={[style.bottomContainer, { flexDirection: language === 'he' ? 'row-reverse' : 'row' }]}>
                    <Text style={style.registerText}>{HomeText[language].notRegistered} </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={style.registerLink}>{HomeText[language].registerHere}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BasicScreen>
    );
}

const style = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        width: '100%', 
        height: '100%', 
        backgroundColor: 'white',
        paddingTop: 20,
    },    
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
        backgroundColor: 'white',
    },
    forgotPassword: {
        marginTop: 1,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    registerText: {
        fontSize: 16,
    },
    registerLink: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
    }
});

const HomeText = {
    en: {
        title: 'Login',
        subtitle: 'Always with you - anywhere, anytime',
        login: 'Login',
        register: 'Register',
        passwordPlaceholder: 'Password',
        usernamePlaceholder: 'Username',
        forgotPassword: 'Forgot password?',
        notRegistered: 'Not registered?',
        registerHere: 'Register here',
    },
    he: {
        title: 'כניסה',
        subtitle: 'תמיד איתך - בכל מקום, בכל שעה',
        login: 'כניסה',
        register: 'הרשם',
        passwordPlaceholder: 'סיסמה',
        usernamePlaceholder: 'שם משתמש',
        forgotPassword: 'שכחתם סיסמה?',
        notRegistered: 'לא רשום?',
        registerHere: 'הרשם כאן',
    }
};

import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements';

import MyLanguageContext from '../utils/MyLanguageContext';

import defineTextAlignStyle from '../utils/defineTextAlignStyle';

// Navigate to a specific screen
const moveToDashboard = (navigation, screenName, params = {}) => {
    navigation.navigate(screenName, params);
};


export default function LoginScreen({ navigation }) {

    const { language } = useContext(MyLanguageContext);  // Language context

    const input_style = defineTextAlignStyle(language, style.input);

    // State hooks for managing input values and role selection
    const [email, setEmail] = useState('');  // Email state
    const [password, setPassword] = useState('');  // Password state
    const [selectedRole, setSelectedRole] = useState(0);  // Role selection (0 = Citizen, 1 = Security)

    const roleOptions = ["citizen", "security"];  // Role options available

    /**
     * Handles the login logic when the user submits the form.
     * For now, it redirects to a dashboard based on the selected role.
     */
    const handleLogin = () => {

        // Test behavior: If no email/password entered, automatically log in as Citizen
        if (email.length == 0 && password.length == 0) {

            var dashboard_type = selectedRole == 0;

            var role_name = 'Security';

            if (dashboard_type) {
                role_name = 'Citizen';
            }

            moveToDashboard(navigation, `Dashboard/${role_name}`);
        }
    }

    return (
        <View style={style.container}>
            <Card>
                <Text>{LoginText[language].title}</Text>

                {/* Username Input */}
                <TextInput 
                    style={input_style}
                    value={email} 
                    onChangeText={setEmail} 
                    placeholder={LoginText[language].email}
                />

                {/* Password Input */}
                <TextInput 
                    style={input_style}
                    value={password} 
                    onChangeText={setPassword} 
                    placeholder={LoginText[language].password} 
                    secureTextEntry 
                />

                <View style={style.roleContainer}>
                    <Text>Select your role:</Text>
                    <View style={style.roleButtons}>
                        {/* Role selection buttons */}
                        {roleOptions.map((role, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={[style.roleButton, selectedRole === index && style.selectedRoleButton]}
                                onPress={() => setSelectedRole(index)}
                            >
                                <Text style={style.roleButtonText}>{LoginText[language][role]}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Login button */}
                <Button
                    title="Log In"
                    onPress={handleLogin}
                />
            </Card>
        </View>
    );
}

// Styles for the login screen
const style = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        paddingHorizontal: 10,
        width: 300,
    },
    roleContainer: {
        marginVertical: 20,
    },
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 300,
    },
    roleButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '45%',
        alignItems: 'center',
    },
    selectedRoleButton: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    roleButtonText: {
        color: '#333',
    },
    buttonGroup: {
        width: 300,
    },
});


const LoginText = {
    en: {
        title: 'Login',
        password: 'Enter your Password',
        email: 'Enter your Email',
        rememberMe: 'Remember me',
        security: 'Security',
        citizen: 'Citizen',
        submit: 'Submit',
    },
    he: {
        title: 'כניסה',
        email: 'אימייל',
        password: 'סיסמה',
        rememberMe: 'זכור אותי',
        security: 'אבטחה',
        citizen: 'אזרח',
        submit: 'שלח',
    },
};
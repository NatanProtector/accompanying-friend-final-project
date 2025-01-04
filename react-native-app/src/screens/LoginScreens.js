import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements';

import { LoginText } from '../constants/text';
import MyLanguageContext from '../utils/MyLanguageContext';

export default function LoginScreen({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    // State hooks for managing input values and role selection
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState(0); // 0 for Citizen, 1 for Security

    const roleOptions = ["citizen", "security"];

    const handleLogin = () => {
        // Handle login logic here
        console.log('Logging in with:', email, password, roleOptions[selectedRole]);

        // For Testing purposes ========================== Testing ===================================================
        if (email.length == 0 && password.length == 0) {
            if (selectedRole == 0)
                navigation.navigate('Dashboard/Citizen');
            else
                navigation.navigate('Dashboard/Security');
        }
        // ======================================================================================================

    }

    return (
        <View style={style.container}>
            <Card>
                <Text>{LoginText[language].title}</Text>

                {/* Username Input */}
                <TextInput 
                    style={style.input}
                    value={email} 
                    onChangeText={setEmail} 
                    placeholder={LoginText[language].email}
                />

                {/* Password Input */}
                <TextInput 
                    style={style.input}
                    value={password} 
                    onChangeText={setPassword} 
                    placeholder={LoginText[language].password} 
                    secureTextEntry 
                />

                <View style={style.roleContainer}>
                    <Text>Select your role:</Text>
                    <View style={style.roleButtons}>
                        {roleOptions.map((role, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={[
                                    style.roleButton, 
                                    selectedRole === index && style.selectedRoleButton
                                ]}
                                onPress={() => setSelectedRole(index)}
                            >
                                <Text style={style.roleButtonText}>{LoginText[language][role]}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <Button
                    title="Log In"
                    onPress={handleLogin}
                />
            </Card>
        </View>
    );
}

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
        width: 300, // Adjust the width as needed
    },
    roleContainer: {
        marginVertical: 20,
    },
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 300,  // You can adjust the width to suit your design
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
        width: 300,  // You can adjust the width to suit your design
    },
});

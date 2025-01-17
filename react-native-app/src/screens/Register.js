import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';

import { useContext } from 'react';

import { RegisterText } from '../constants/text';

import MyLanguageContext from '../utils/MyLanguageContext';



export default function Register({ navigation }) {

  const { language } = useContext(MyLanguageContext);

  return (
    <View style={CardStyle.container}>
      <Card>
        <Text style={TextStyle.container}>{RegisterText[language].title}</Text>
        <Card.Divider />
        {/* Citizen Registration Button */}
        <Button
          title={RegisterText[language].citizen}
          onPress={() => navigation.navigate('RegisterForm', { registerAs: 'citizen' })}
        />
        {/* Security Registration Button */}
        <Button
          title={RegisterText[language].security}
          onPress={() => navigation.navigate('RegisterForm', { registerAs: 'security' })}
        />
      </Card>
    </View>
  );
}

const CardStyle = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

const TextStyle = StyleSheet.create({
  container: { fontSize: 18, marginBottom: 10 },
});

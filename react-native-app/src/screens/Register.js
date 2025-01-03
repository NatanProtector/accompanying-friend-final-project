import React from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { Card,Button } from 'react-native-elements';

export default function Register({ navigation }) {
  return (
    <View style={CardStyle.container}>
      <Card>
        <Text style={TextStyle.container}>You are registering as a..</Text>
        <Card.Divider />
        <Button
          title="Citezen"
          onPress={() => console.log('Citezen')}
        />
        <Button
          title="Security"
          onPress={() => console.log('Security')}
        />
        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Home')}
        />
      </Card>
    </View>
  );
}

const CardStyle = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

const TextStyle = StyleSheet.create({
  container: { fontSize: 18, marginBottom: 10 }
})
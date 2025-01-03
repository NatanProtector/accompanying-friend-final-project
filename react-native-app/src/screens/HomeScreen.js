import { StyleSheet, Text, View } from 'react-native';
import { Card,Button } from 'react-native-elements';


export default function HomeScreen({ navigation }) {

    return (
        <View style={style.container}>
            <Card title="Welcome!">
                <Text>Home Screen</Text>
                <Button
                title="Login"
                onPress={() => navigation.navigate('Login')}
                />
                <Button
                title="Register"
                onPress={() => navigation.navigate('Register')}
                />
            </Card>
        </View>
    );
}

const style = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
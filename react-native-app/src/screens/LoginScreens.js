import { StyleSheet, Text, View } from 'react-native';
import { Card,Button } from 'react-native-elements';

export default function LoginScreen({ navigation }) {

    return (
        <View style={style.container}>
            <Card>
                <Text>Login Screen</Text>
                <Button
                title="Go to Home"
                onPress={() => navigation.navigate('Home')}
                />
            </Card>
        </View>
    );
}


const style = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
import { StyleSheet, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { useContext } from 'react';

import { HomeText } from '../constants/text';
import MyLanguageContext from '../utils/MyLanguageContext';

export default function HomeScreen({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.card} title={HomeText[language].title}>
                <View style={styles.buttonContainer}>
                    <Button
                        title={HomeText[language].login}
                        onPress={() => navigation.navigate('Login')}
                        buttonStyle={styles.button}
                    />
                    <Button
                        title={HomeText[language].register}
                        onPress={() => navigation.navigate('Register')}
                        buttonStyle={styles.button}
                    />
                    <Button
                        title={HomeText[language].map}
                        onPress={() => navigation.navigate('Map')}
                        buttonStyle={styles.button}
                    />
                </View>
            </Card>
        </View>
    );
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        padding: 10,
    },
    card: {
        borderWidth: 2,
        borderColor: '#000',
        width: '100%',
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '100%',
    },
    button: {
        marginVertical: 10,
        borderWidth: 2,
        borderColor: '#000',
    },
});
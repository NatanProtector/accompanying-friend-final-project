import { StyleSheet, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { useContext } from 'react';

import { HomeText } from '../constants/text';
import MyLanguageContext from '../utils/MyLanguageContext';

export default function HomeScreen({ navigation }) {

    const { language } = useContext(MyLanguageContext);

    return (
        <View style={style.container}>
            <Card title={HomeText[language].title}>
                <Button
                    title={HomeText[language].login}
                    onPress={() => navigation.navigate('Login')}
                />
                <Button
                    title={HomeText[language].register}
                    onPress={() => navigation.navigate('Register')}
                />
                <Button
                    title={HomeText[language].map}
                    onPress={() => navigation.navigate('Map')}
                />
            </Card>
        </View>
    );
}

const style = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
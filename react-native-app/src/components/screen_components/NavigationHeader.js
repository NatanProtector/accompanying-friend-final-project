import { StyleSheet, View, Text } from 'react-native';
import MyLanguageContext from '../../utils/MyLanguageContext';
import { useContext } from 'react';

export default function NavigationHeader() {
    const { language } = useContext(MyLanguageContext);

    const direction = language === 'he' ? 'row' : 'row-reverse'

    return (
        <View style={[styles.container, { flexDirection: direction }]}>
            <View style={styles.alert_container}>
                <Text>Alerts</Text>
            </View>
            <View style={styles.display_container}>
                <Text>Display</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 35,
        margin: 5,
    },
    alert_container: {
        width: '35%',
        backgroundColor: 'green',
    },
    display_container: {
        width: '65%',
        backgroundColor: 'yellow',
    },
});

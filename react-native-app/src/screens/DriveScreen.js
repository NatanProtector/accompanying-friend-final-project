import { StyleSheet, View } from 'react-native';

import MapScreen from './MapScreen';

import BasicScreen from '../components/screenComponents/BasicScreen';

import MyLanguageContext from '../utils/MyLanguageContext';

import { useContext } from 'react';

export default function DriveScreen() {

    const { language } = useContext(MyLanguageContext);

    return (
        <BasicScreen>
            <View style={styles.container}>
                <MapScreen/>
            </View>
        </BasicScreen>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
        overflow: 'hidden'
    },
});
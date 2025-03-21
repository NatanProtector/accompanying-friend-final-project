import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import BasicScreenTemplate from '../components/screenComponents/BasicScreenTemplate';
import MapScreen from './MapScreen';
// import BasicNavigationScreen from '../components/screenComponents/BasicNavigationScreen';
// import MyLanguageContext from '../utils/MyLanguageContext';
// import { useContext } from 'react';

export default function DriveScreen() {
    // const { language } = useContext(MyLanguageContext);

    return (
        <BasicScreenTemplate 
        
        HeaderComponent={<Text>Test</Text>}
        
        FooterComponent={

            /* Magnifying Glass Button */
            <TouchableOpacity style={styles.searchButton} onPress={() => console.log('Search pressed')}>
                <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>

        }

        >
            <View style={styles.container}>
                <MapScreen />
            </View>

        </BasicScreenTemplate>
    );
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
        overflow: 'hidden',
    },
    searchButton: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        backgroundColor: '#4958FF',

        padding: 10,
        borderRadius: 25,
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    searchIcon: {
        fontSize: 24,
    },
});

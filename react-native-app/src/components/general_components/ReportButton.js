import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ReportButton({ onPress, language }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{ReportText[language].title}</Text>
            </TouchableOpacity>
        </View>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },    
    button: {
        backgroundColor: '#FF4242',
        width: 90,
        height: 40,
        margin: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

const ReportText = {
    en: {
        title: 'Report',
    },
    he: {
        title: 'דיווח',
    }
}

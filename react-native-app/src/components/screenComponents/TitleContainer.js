import { View, StyleSheet } from "react-native";


export default function TitleContainer({ children }) {
    return (
        <View style={styles.container}>{children}</View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1.8,  
        justifyContent: "flex-end", 
        alignItems: "flex-start", 
        width: '100%',
        padding: 10,
    },
});

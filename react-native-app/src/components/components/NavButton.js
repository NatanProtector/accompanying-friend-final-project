import { Button } from "react-native-elements";
import { StyleSheet } from "react-native";

const NavButton = ({ title, onPress }) => {
    return (
        <Button 
            title={title} 
            onPress={onPress} 
            buttonStyle={styles.button}
            containerStyle={styles.container}
        />

    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4958FF',
        width: 200,
        height: 40,
        fontSize: 18,
        margin: 5,
        borderRadius: 5,
    },
    container: {
        width: 210,
    }
});

export default NavButton;

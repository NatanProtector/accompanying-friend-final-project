import { Button } from "react-native-elements";
import { StyleSheet } from "react-native";

const NavButton = ({ title, onPress }) => {
    return (
        <Button 
            title={title} 
            onPress={onPress} 
            buttonStyle={styles.button} // Apply fixed width
            containerStyle={styles.container} // Ensures layout constraints
        />
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4958FF',
        width: 200,
        height: 40,
    },
    container: {
        width: 200,
    }
});

export default NavButton;

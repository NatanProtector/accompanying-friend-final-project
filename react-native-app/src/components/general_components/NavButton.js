import { Button } from "react-native-elements";
import { StyleSheet } from "react-native";

const NavButton = ({ title, onPress , titleStyle}) => {
    return (
        <Button 
            title={title} 
            onPress={onPress} 
            buttonStyle={styles.button}
            containerStyle={styles.container}
            titleStyle={titleStyle || styles.title }
        />
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4958FF',
        width: 220,
        height: 50,
        margin: 15,
        borderRadius: 5,
    },
    container: {
        width: 250,
    },
    title: {
        fontSize: 22, 
    }
});

export default NavButton;

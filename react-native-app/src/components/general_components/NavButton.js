import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const NavButton = ({ title, onPress, titleStyle, icon, language = "en" }) => {
  const isRTL = language === "he";

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={styles.buttonContent}>
        {icon && (
          <Icon
            name={icon}
            size={24}
            color="white"
            style={[styles.icon, isRTL ? styles.iconRight : styles.iconLeft]}
          />
        )}
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {icon && <View style={styles.iconSpacer} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4958FF",
    width: 220,
    height: 50,
    margin: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  title: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  iconLeft: {
    position: "absolute",
    left: 15,
  },
  iconRight: {
    position: "absolute",
    right: 15,
  },
  iconSpacer: {
    width: 24, // Same width as icon to maintain centering
  },
});

export default NavButton;

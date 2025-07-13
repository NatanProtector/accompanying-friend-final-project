import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

export default function ButtonWrapper({ children, onClick, title }) {
  return (
    <View style={styles.container}>
      <View style={styles.childContainer}>
        {children}
        </View>
      <TouchableOpacity onPress={onClick} style={styles.languageButton}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  childContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  languageButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#5160FF",
    padding: 10,
    borderRadius: 5,
    width: 80,
    height: 40,
    alignItems: "center",
    // Padding to prevent the language button from overlapping with the OS bottom navigation buttons
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
  },
});

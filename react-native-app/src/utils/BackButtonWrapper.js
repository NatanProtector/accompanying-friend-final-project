import React, { useContext } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MyLanguageContext from "./MyLanguageContext"; // Import context

export default function BackButtonWrapper({ children }) {
  const navigation = useNavigation();
  const { language } = useContext(MyLanguageContext); // Get language from context

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.buttonText}>
          {language === "en" ? "Back" : "חזור"}
        </Text>
      </TouchableOpacity>
      <View style={styles.childContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  childContainer: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2089dc",
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

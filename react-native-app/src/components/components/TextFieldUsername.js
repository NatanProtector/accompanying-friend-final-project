import React from "react";
import { StyleSheet, I18nManager } from "react-native";
import { Input } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons"; // Ensure you have expo-vector-icons installed

export default function TextFieldUsername({ value, onChangeText, placeholder, iconPosition, language }) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      leftIcon={iconPosition === "left" ? <FontAwesome name="user" size={20} color="gray" /> : null}
      rightIcon={iconPosition === "right" ? <FontAwesome name="user" size={20} color="gray" /> : null}
      containerStyle={styles.container}
      inputStyle={[
        styles.input,
        { textAlign: language === "he" ? "right" : "left" } // Set right alignment for Hebrew
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%", // Full width input field
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Input } from "react-native-elements"
import { FontAwesome } from "@expo/vector-icons";

export default function TextField({ value, onChangeText, onFocus, placeholder, iconPosition, errorMessage, language, icon }) {
  const [isFocused, setIsFocused] = useState(false);

  const renderIcon = () => {
    switch (icon) {
      case "letter":
        return <FontAwesome name="envelope" size={20} color="gray" />;
      case "phone":
        return <FontAwesome name="phone" size={20} color="gray" />;
      case "user":
        return <FontAwesome name="user" size={20} color="gray" />;
      case "lock":
        return <FontAwesome name="lock" size={20} color="gray" />;
      default:
        return null;
    }
  };

  const textAlign = language === "he" ? "right" : "left"

  const focusHandler = () => {
    setIsFocused(true);
    onFocus && onFocus()
  };

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      leftIcon={iconPosition === "left" ? renderIcon() : null}
      rightIcon={iconPosition === "right" ? renderIcon() : null}
      containerStyle={styles.container}
      inputContainerStyle={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused
      ]}
      inputStyle={[
        styles.input,
        { textAlign: textAlign}
      ]}
      onFocus={focusHandler}
      onBlur={() => setIsFocused(false)}
      errorStyle={[styles.error, { textAlign: textAlign}]}
      errorMessage={errorMessage}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor: 'green',
    // marginBottom: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    // Simple shadow / depth
    shadowColor: "#000",    
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  inputContainerFocused: {
    borderColor: "#4A90E2", // Blue highlight on focus
  },
  input: {
    fontSize: 16,
    color: "black",
  },
  error: { color: "red", fontSize: 14 },
});

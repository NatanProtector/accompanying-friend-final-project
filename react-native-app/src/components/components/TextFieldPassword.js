import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";

export default function TextFieldPassword({ value, onChangeText, placeholder, onFocus, iconPosition, errorMessage, language }) {
  const [isFocused, setIsFocused] = useState(false);
  const align = language === "he" ? "right" : "left";

  return (
    <View style={[styles.container, { flexDirection: language === "he" ? "row-reverse" : "row" }]}>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry
        leftIcon={iconPosition === "left" ? <FontAwesome name="lock" size={20} color="gray" /> : null}
        rightIcon={iconPosition === "right" ? <FontAwesome name="lock" size={20} color="gray" /> : null}
        containerStyle={styles.inputContainer}
        inputContainerStyle={[
          styles.inputInnerContainer,
          isFocused && styles.inputFocused
        ]}
        inputStyle={[styles.input, { textAlign: align }]}
        placeholderTextColor="gray"
        onFocus={() => { onFocus && onFocus(); setIsFocused(true)}}
        onBlur={() => setIsFocused(false)}
        errorStyle={[styles.error, { textAlign: align}]}
        errorMessage={errorMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
  },
  inputInnerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  inputFocused: {
    borderColor: "#4A90E2", // Blue border on focus
  },
  input: {
    fontSize: 16,
    color: "black",
  },
  error: { color: "red", fontSize: 14 },
});

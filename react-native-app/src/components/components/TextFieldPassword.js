import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";

export default function TextFieldPassword({
  value,
  onChangeText,
  placeholder,
  onFocus,
  iconPosition,
  errorMessage,
  language
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const align = language === "he" ? "right" : "left";

  // Set lock icon depending on language
  const lockIcon =
    language === "he"
      ? { rightIcon: <FontAwesome name="lock" size={20} color="gray" /> }
      : { leftIcon: <FontAwesome name="lock" size={20} color="gray" /> };

  // Set eye icon depending on language
  const eyeIcon = (
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="gray" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { flexDirection: language === "he" ? "row-reverse" : "row" }]}>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        {...lockIcon}
        {...(language === "he"
          ? { leftIcon: eyeIcon }
          : { rightIcon: eyeIcon })}
        containerStyle={styles.inputContainer}
        inputContainerStyle={[
          styles.inputInnerContainer,
          isFocused && styles.inputFocused
        ]}
        inputStyle={[styles.input, { textAlign: align }]}
        placeholderTextColor="gray"
        onFocus={() => {
          onFocus && onFocus();
          setIsFocused(true);
        }}
        onBlur={() => setIsFocused(false)}
        errorStyle={[styles.error, { textAlign: align }]}
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
    elevation: 3,
  },
  inputFocused: {
    borderColor: "#4A90E2",
  },
  input: {
    fontSize: 16,
    color: "black",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
});

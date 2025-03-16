import React from "react";
import { StyleSheet, View } from "react-native";
import { Input } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons"; // Ensure you have expo-vector-icons installed

export default function TextFieldPassword({ value, onChangeText, placeholder, iconPosition, language }) {
    
    const align = language === "he" ? "right" : "left"

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
        inputStyle={[styles.input, { textAlign: align }]}
        placeholderTextColor="gray"
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
    flex: 1, // Allow full width alignment
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

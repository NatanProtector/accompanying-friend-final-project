import React from "react";
import TextField from "./TextField"; // Adjust the path based on your project structure

export default function TextFieldUsername({ value, onChangeText, placeholder, iconPosition, language }) {
  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      icon="user"                 // Using the 'user' icon
      iconPosition={iconPosition}
      language={language}
    />
  );
}
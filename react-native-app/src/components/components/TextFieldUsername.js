import React from "react";
import TextField from "./TextField";

export default function TextFieldUsername({ value, onChangeText, placeholder, iconPosition, language }) {
  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      icon="user"
      iconPosition={iconPosition}
      language={language}
    />
  );
}


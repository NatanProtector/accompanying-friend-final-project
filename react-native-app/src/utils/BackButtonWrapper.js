import React, { useContext } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MyLanguageContext from "./MyLanguageContext";

export default function BackButtonWrapper({ children }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { language } = useContext(MyLanguageContext);

  // Clone children and pass route params to the first child that is a React element
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...route.params });
    }
    return child;
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.buttonText}>
          {language === "en" ? "Back" : "חזור"}
        </Text>
      </TouchableOpacity>
      <View style={styles.childContainer}>{childrenWithProps}</View>
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
    backgroundColor: "#414FEC",
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
    width: 65,
    height: 40,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

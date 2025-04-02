import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const DriverDirections = ({ steps, currentStepIndex }) => {
  const getDirectionIcon = (maneuver) => {
    switch (maneuver) {
      case "turn-left":
        return "↖️";
      case "turn-right":
        return "↗️";
      case "turn-sharp-left":
        return "↙️";
      case "turn-sharp-right":
        return "↘️";
      case "slight-left":
        return "↖️";
      case "slight-right":
        return "↗️";
      case "straight":
        return "⬆️";
      case "uturn":
        return "↩️";
      case "roundabout-left":
      case "roundabout-right":
        return "🔄";
      case "merge":
        return "🔄";
      case "fork-left":
        return "↖️";
      case "fork-right":
        return "↗️";
      case "ramp-left":
        return "↖️";
      case "ramp-right":
        return "↗️";
      default:
        return "➡️";
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Route Directions</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {steps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepContainer,
              index === currentStepIndex && styles.currentStep,
            ]}
          >
            <View style={styles.stepHeader}>
              <Text style={styles.stepIcon}>
                {getDirectionIcon(step.maneuver)}
              </Text>
              <Text style={styles.stepDistance}>
                {formatDistance(step.distance.value)}
              </Text>
            </View>
            <Text style={styles.stepText}>
              {step.html_instructions.replace(/<[^>]+>/g, "")}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    maxHeight: 300,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    maxHeight: 250,
  },
  stepContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  currentStep: {
    backgroundColor: "#e6f3ff",
    borderRadius: 8,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  stepIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  stepDistance: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  stepText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DriverDirections;

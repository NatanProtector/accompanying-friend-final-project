import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NotificationWrapper = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Show the modal 5 seconds after component mounts
    const timer = setTimeout(() => {
      setIsModalVisible(true);
    }, 5000);

    // Cleanup the timer if component unmounts
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const navigateToCoordinates = () => {
    navigation.navigate("StartRide/Security", {
      initialDestination: {
        latitude: 31.7683,
        longitude: 35.2137,
      },
    });
    closeModal();
  };

  return (
    <>
      {children}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>This is a notification demo!</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.closeButton, styles.navigateButton]}
              onPress={navigateToCoordinates}
            >
              <Text style={styles.closeButtonText}>
                Navigate to Coordinates
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  navigateButton: {
    backgroundColor: "#4CAF50",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotificationWrapper;

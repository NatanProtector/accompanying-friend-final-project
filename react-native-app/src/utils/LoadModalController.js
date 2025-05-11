import React, { useState } from "react";
import { Modal, View, StyleSheet, ActivityIndicator } from "react-native";

const LoadModal = ({ visible }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    </Modal>
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
    elevation: 5,
  },
});

const LoadModalController = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoad = () => {
    setIsLoading(true);
  };

  const endLoad = () => {
    setIsLoading(false);
  };

  return {
    startLoad,
    endLoad,
    LoadModal: () => <LoadModal visible={isLoading} />,
  };
};

export default LoadModalController;

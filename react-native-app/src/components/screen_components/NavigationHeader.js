import { StyleSheet, View, Text, Modal, TouchableOpacity, FlatList } from "react-native";
import { useContext, useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import MyLanguageContext from "../../utils/MyLanguageContext";
import { ReportEmergency } from "../../utils/Communication";
import ReportButton from "../general_components/ReportButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "@env";

export default function NavigationHeader({ DisplayComponent }) {
  const { language } = useContext(MyLanguageContext);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const direction = language === "he" ? "row" : "row-reverse";

  const handleReportPress = () => setShowReportModal(true);

  const handleReportSubmit = async () => {
    console.log("Selected option:", selectedOption);
    const result = await ReportEmergency(selectedOption);
    console.log(result);
    setShowReportModal(false);
  };

  const handleCancel = () => {
    console.log("Cancelled. Selected option:", selectedOption);
    setShowReportModal(false);
  };

  const renderRadioButton = (label, value) => (
    <TouchableOpacity
      style={[
        styles.radioButton,
        selectedOption === value && styles.radioButtonSelected,
      ]}
      onPress={() => setSelectedOption(value)}
    >
      <Text
        style={
          selectedOption === value
            ? styles.radioButtonTextSelected
            : styles.radioButtonText
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        if (!stored) return;
        const { _id } = JSON.parse(stored);
  
        // Fetch notifications
        const res = await fetch(`${SERVER_URL}/api/auth/notifications/${_id}`);
        const data = await res.json();
        setNotifications(data);
  
        // Mark all as read
        await fetch(`${SERVER_URL}/api/auth/notifications/mark-read/${_id}`, {
          method: "PATCH",
        });
  
        // Remove the red dot
        setHasUnread(false);
      } catch (err) {
        console.error("[NOTIFICATIONS] Fetch/mark-read failed:", err);
      }
    };
  
    if (modalVisible) fetchNotifications();
  }, [modalVisible]);
  


  useEffect(() => {
    const checkUnread = async () => {
      const stored = await AsyncStorage.getItem("userData");
      if (!stored) return;
      const { _id } = JSON.parse(stored);
  
      const res = await fetch(`${SERVER_URL}/api/auth/notifications/unread/${_id}`);
      const data = await res.json();
      setHasUnread(data.unreadCount > 0);
    };
  
    checkUnread();
  }, []);
  
  
  return (
    <View style={[styles.container, { flexDirection: direction }]}>
      <View style={styles.alert_container}>
        <ReportButton onPress={handleReportPress} language={language} />
      </View>

      <View style={styles.display_container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {DisplayComponent}
        </View>
      </View>

      {/* 🔔 Notification Bell */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ paddingHorizontal: 10, justifyContent: "center" }}>
      <View>
  <Text style={{ fontSize: 22 }}>🔔</Text>
  {hasUnread && <View style={styles.redDot} />}
</View>

      </TouchableOpacity>

      {/* Emergency Report Modal */}
      <Modal visible={showReportModal} transparent animationType="fade" onRequestClose={() => setShowReportModal(false)}>
        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>{labels_text[language].title}</Text>
              <View style={styles.radioGroup}>
                {renderRadioButton(labels_text[language].option1, "option1")}
                {renderRadioButton(labels_text[language].option2, "option2")}
                {renderRadioButton(labels_text[language].option3, "option3")}
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleReportSubmit}>
                  <Text style={styles.buttonText}>{labels_text[language].report}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.buttonText}>{labels_text[language].cancel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* 🔔 Notifications Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerBox}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.notificationId}
              renderItem={({ item }) => (
                <View style={styles.notificationItem}>
                  <Text style={styles.notificationText}>{item.message}</Text>
                  <Text style={styles.timestamp}>{new Date(item.sentAt).toLocaleString()}</Text>
                </View>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    marginTop: 35,
  },
  alert_container: { width: "25%" },
  display_container: { width: "55%" },

  // Emergency modal
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalText: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  radioButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  radioButtonSelected: { backgroundColor: "#000" },
  radioButtonText: { color: "#000", fontSize: 14 },
  radioButtonTextSelected: { color: "#fff", fontSize: 14 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  actionButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "gray" },
  buttonText: { color: "white", fontSize: 16 },

  // 🔔 Notifications modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },  
  modalContainerBox: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  notificationText: { fontSize: 16 },
  timestamp: { fontSize: 12, color: '#888' },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
});

const labels_text = {
  en: {
    title: "Select Report Reason:",
    option1: "Attempted Vehicle Theft",
    option2: "Shooting",
    option3: "Other",
    report: "Report",
    cancel: "Cancel",
  },
  he: {
    title: "בחר סיבה לדיווח:",
    option1: "ניסיון גניבת רכב",
    option2: "ירי",
    option3: "אחר",
    report: "דווח",
    cancel: "ביטול",
  },
};

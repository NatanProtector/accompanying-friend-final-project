import { StyleSheet, View, Text, Modal, TouchableOpacity } from "react-native";
import { useContext, useState } from "react";
import { BlurView } from "expo-blur";
import MyLanguageContext from "../../utils/MyLanguageContext";
import { ReportEmergency } from "../../utils/Communication";
import ReportButton from "../components/ReportButton";

export default function NavigationHeader() {
  const { language } = useContext(MyLanguageContext);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("option1");

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

  return (
    <View style={[styles.container, { flexDirection: direction }]}>
      <View style={styles.alert_container}>
        <ReportButton onPress={handleReportPress} language={language} />
      </View>

      <View style={styles.display_container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "gray" }}
        >
          <Text>Display</Text>
        </View>
      </View>

      <Modal
        visible={showReportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReportModal(false)}
      >
        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>
                {labels_text[language].title}
              </Text>

              {/* Radio Buttons as Buttons */}
              <View style={styles.radioGroup}>
                {renderRadioButton(labels_text[language].option1, "option1")}
                {renderRadioButton(labels_text[language].option2, "option2")}
                {renderRadioButton(labels_text[language].option3, "option3")}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleReportSubmit}
                >
                  <Text style={styles.buttonText}>
                    {labels_text[language].report}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>
                    {labels_text[language].cancel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    marginTop: 35,
    // margin: 5,
  },
  alert_container: {
    width: "35%",
  },
  display_container: {
    width: "65%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
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
  radioButtonSelected: {
    backgroundColor: "#000",
  },
  radioButtonText: {
    color: "#000",
    fontSize: 14,
  },
  radioButtonTextSelected: {
    color: "#fff",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

const labels_text = {
  en: {
    title: "Select Report Reason:",
    option1: "Attempted Vihicle Theft",
    option2: "shooting",
    option3: "Other",
    report: "Report",
    cancel: "Cancel",
  },
  he: {
    title: "בחר סיבה לדיווח:",
    option1: "ניסיון גניבת רכב",
    option2: "ירי",
    option3: "זריקת בקבוקי תבערה",
    report: "דווח",
    cancel: "ביטול",
  },
};

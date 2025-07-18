import { StyleSheet, View, Text, Modal, TouchableOpacity } from "react-native";
import { useContext, useState } from "react";
import { BlurView } from "expo-blur";
import MyLanguageContext from "../../utils/MyLanguageContext";
import { ReportEmergency } from "../../utils/Communication";
import ReportButton from "../general_components/ReportButton";

export default function NavigationHeader({ DisplayComponent }) {
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
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "gray",
          }}
        >
          {DisplayComponent}
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
                <View style={styles.radioRow}>
                  {renderRadioButton(labels_text[language].option1, "option1")}
                  {renderRadioButton(labels_text[language].option2, "option2")}
                  {renderRadioButton(labels_text[language].option3, "option3")}
                </View>
                <View style={styles.radioRow}>
                  {renderRadioButton(labels_text[language].option4, "option4")}
                  {renderRadioButton(labels_text[language].option5, "option5")}
                </View>
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
    width: "25%",
  },
  display_container: {
    width: "75%",
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
    width: "100%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  radioGroup: {
    width: "100%",
    marginBottom: 30,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
    minWidth: 120,
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
    option3: "Molotov",
    option4: "Roadblock",
    option5: "Stone Throwing",
    report: "Report",
    cancel: "Cancel",
  },
  he: {
    title: "בחר סיבה לדיווח:",
    option1: "ניסיון גניבת רכב",
    option2: "ירי",
    option3: "בקבוק תבעירה",
    option4: "מחסום",
    option5: "יידוי אבנים",
    report: "דווח",
    cancel: "ביטול",
  },
};

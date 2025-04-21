import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Modal, FlatList, StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SERVER_URL } from "@env";

/**  BUGS:
 * 1. event not registered in notifications, and notification not poping up
 * 2. redirect to location is not working
 * 3. security is constantly getting connected and disconnected during
 */

export default function NotificationWrapper({ children }) {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔴 Get unread count when mounted
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const stored = await AsyncStorage.getItem("userData");
      if (!stored) return;
      const { _id } = JSON.parse(stored);

      const res = await fetch(`${SERVER_URL}/api/auth/notifications/unread/${_id}`);
      const data = await res.json();
      setUnreadCount(data.unreadCount);
    };

    fetchUnreadCount();
  }, []);

  // // 📍 Redirect on first load if any new event is nearby
  // useEffect(() => {
  //   const fetchAndRedirect = async () => {
  //     try {
  //       const stored = await AsyncStorage.getItem("userData");
  //       if (!stored) return;
  //       const { _id, multiRole } = JSON.parse(stored);

  //       const res = await fetch(`${SERVER_URL}/api/auth/notifications/${_id}`);
  //       const data = await res.json();
  //       setNotifications(data);

  //       const unreadEvent = data.find(n =>
  //         !n.readStatus && n.eventRef?.location?.coordinates
  //       );

  //       if (unreadEvent && multiRole.includes("security")) {
  //         const [lng, lat] = unreadEvent.eventRef.location.coordinates;
  //         navigation.navigate("Drive", {
  //           initialDestination: {
  //             latitude: lat,
  //             longitude: lng,
  //           },
  //         });
  //       }

  //       // ✅ Mark as read after redirect
  //       await fetch(`${SERVER_URL}/api/auth/notifications/mark-read/${_id}`, {
  //         method: "PATCH",
  //       });

  //       setUnreadCount(0);
  //     } catch (err) {
  //       console.error("[NOTIFICATIONS] Auto-redirect failed:", err);
  //     }
  //   };

  //   fetchAndRedirect();
  // }, []);

  // 📩 On bell click: fetch & show modal
  const openModal = async () => {
    try {
      const stored = await AsyncStorage.getItem("userData");
      if (!stored) return;
      const { _id } = JSON.parse(stored);

      const res = await fetch(`${SERVER_URL}/api/auth/notifications/${_id}`);
      const data = await res.json();
      setNotifications(data);

      await fetch(`${SERVER_URL}/api/auth/notifications/mark-read/${_id}`, {
        method: "PATCH",
      });

      setUnreadCount(0);
      setModalVisible(true);
    } catch (err) {
      console.error("[NOTIFICATIONS] Fetch/mark-read failed:", err);
    }
  };

  return (
    <>
      {/* 🔔 Bell Button floating at top-right */}
      <TouchableOpacity style={styles.bellContainer} onPress={openModal}>
        <Text style={styles.bellIcon}>🔔</Text>
        {unreadCount > 0 && (
          <View style={styles.redDot}>
            <Text style={styles.redDotText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 🗂 Modal for notifications */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.notificationId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.notificationItem}
                  onPress={() => {
                    if (item.eventRef?.location?.coordinates) {
                      const [lng, lat] = item.eventRef.location.coordinates;
                      setModalVisible(false);
                      navigation.navigate("StartRide/Security", {
                        initialDestination: {
                          latitude: lat,
                          longitude: lng,
                        },
                      });
                    }
                  }}
                >
                  <Text style={styles.notificationText}>{item.message}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.sentAt).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 💡 Your actual app below */}
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  bellContainer: {
    position: "absolute",
    top: 60,
    right: 30,
    zIndex: 9999,
  },
  bellIcon: {
    fontSize: 24,
  },
  redDot: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  redDotText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  notificationText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

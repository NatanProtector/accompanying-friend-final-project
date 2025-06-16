import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Alert, Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SERVER_URL } from "@env";
import io from "socket.io-client";

export default function NotificationWrapper({ children }) {
  const navigation = useNavigation();
const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [socket, setSocket] = useState(null);

  // 🚨 New state for active real-time notification popup
  const [activePopupNotification, setActivePopupNotification] = useState(null);

  useEffect(() => {
  const fetchUserId = async () => {
    const stored = await AsyncStorage.getItem("userData");
    if (!stored) return;
    const { _id } = JSON.parse(stored);
    setUserId(_id);
  };

  fetchUserId();

  const focusListener = navigation.addListener("focus", fetchUserId);
  return () => focusListener(); // cleanup
}, []);


useEffect(() => {
  console.log("[POPUP STATE] Updated to:", activePopupNotification?.notificationId);
}, [activePopupNotification]);


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

  // 📡 Socket IO connection
useEffect(() => {
  if (!userId) return;

  let socketInstance = null;

  const setup = async () => {
    const stored = await AsyncStorage.getItem("userData");
    if (!stored) return;
    const parsed = JSON.parse(stored);

    socketInstance = io(SERVER_URL);

    const { _id, multiRole, idNumber } = parsed;
    console.log("[SOCKET] Registering:", _id);

    socketInstance.emit("register", {
      role: multiRole.includes("security") ? "security" : "citizen",
      userId: _id,
      idNumber,
      location: { type: "Point", coordinates: [0, 0] },
    });

    socketInstance.on("new_notification", (notification) => {
      console.log("[SOCKET] Received:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      setActivePopupNotification(null);
      setTimeout(() => {
        setActivePopupNotification({ ...notification });
      }, 50);
    });
  };

  setup();

  return () => {
    if (socketInstance) {
      socketInstance.disconnect();
      console.log("[SOCKET] Disconnected on cleanup");
    }
  };
}, [userId]);




  

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

  // 📍 Handle "Navigate" button
  const handleNavigate = async () => {
    if (activePopupNotification?.eventRef?.location?.coordinates) {
      const [lng, lat] = activePopupNotification.eventRef.location.coordinates;
      setActivePopupNotification(null); // Just close popup, no mark-as-read
      navigation.navigate("StartRide/Security", {
        initialDestination: {
          latitude: lat,
          longitude: lng,
        },
      });
    } else {
      Alert.alert("Missing location", "This event has no location data.");
    }
  };
  
  

  // ❌ Handle "Ignore" button
  const handleIgnore = () => {
    setActivePopupNotification(null); // Just close popup, no mark-as-read
  };
  
  

  const markAsRead = async (notificationId) => {
    const stored = await AsyncStorage.getItem("userData");
    if (!stored) return;
    const { _id } = JSON.parse(stored);
  
    try {
      await fetch(`${SERVER_URL}/api/auth/notifications/mark-read/${_id}`, {
        method: "PATCH",
      });
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("[NOTIFICATIONS] Failed to mark as read:", err);
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

      {/* 🗂 Modal for bell notifications history */}
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

      {/* 🚨 Real-Time Popup Modal for new incoming event */}
      {activePopupNotification && (
        <Modal
  key={activePopupNotification?.notificationId || "modal-default"}
  visible={true}
  transparent
  animationType="fade"
>

          <View style={styles.popupOverlay}>
            <View style={styles.popupBox}>
              <Text style={styles.popupTitle}>🚨 New Event Reported!</Text>

              <Text style={styles.popupText}>Message: {activePopupNotification.message}</Text>

              {activePopupNotification.eventRef?.location?.coordinates && (
                <Text style={styles.popupText}>
                  Coordinates: {activePopupNotification.eventRef.location.coordinates[1].toFixed(5)}, {activePopupNotification.eventRef.location.coordinates[0].toFixed(5)}
                </Text>
              )}

              {activePopupNotification.eventRef?.address && (
                <Text style={styles.popupText}>Address: {activePopupNotification.eventRef.address}</Text>
              )}

              <View style={styles.popupButtonRow}>
                <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
                  <Text style={styles.buttonText}>Navigate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ignoreButton} onPress={handleIgnore}>
                  <Text style={styles.buttonText}>Ignore</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* 💡 Your actual app content below */}
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
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  popupText: {
    fontSize: 16,
    marginVertical: 5,
  },
  popupButtonRow: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-around",
  },
  navigateButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 6,
    minWidth: "40%",
    alignItems: "center",
  },
  ignoreButton: {
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 6,
    minWidth: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

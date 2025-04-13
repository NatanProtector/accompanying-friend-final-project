import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authorizedFetch } from '../utils/Communication';

const SERVER_URL = "http://10.0.0.17:3001";

const TestRoutesScreen = () => {
  const [results, setResults] = useState({});
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [allEvents, setAllEvents] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);

  const testRoute = async (label, fetchFunction) => {
    try {
      const data = await fetchFunction();
      setResults((prev) => ({ ...prev, [label]: { success: true, data } }));
    } catch (err) {
      setResults((prev) => ({ ...prev, [label]: { success: false, error: err.message } }));
    }
  };

  const updateEventStatus = async (eventId, newStatus) => {
    try {
      await authorizedFetch(`${SERVER_URL}/api/events/${eventId}/status`, {
        method: "PUT",
        body: JSON.stringify({ newStatus })
      });
      fetchAllEvents();
    } catch (err) {
      console.error("Failed to update event status:", err);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const res = await authorizedFetch(`${SERVER_URL}/api/events`);
      const json = await res.json();
      setAllEvents(json);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const routes = [
    {
      label: "GET /auth/healthcheck",
      call: () => fetch(`${SERVER_URL}/api/auth/healthcheck`).then(res => res.json())
    },
    {
      label: "GET /auth/get-user/:email",
      call: () => fetch(`${SERVER_URL}/api/auth/get-user/${email}`).then(res => res.json())
    },
    {
      label: "GET /auth/get-user-by-id/:userId",
      call: () => fetch(`${SERVER_URL}/api/auth/get-user-by-id/${userId}`).then(res => res.json())
    },
    {
      label: "GET /auth/get-user-by-idNumber/:idNumber",
      call: () => fetch(`${SERVER_URL}/api/auth/get-user-by-idNumber/${idNumber}`).then(res => res.json())
    },
    {
      label: "GET /auth/pending-users",
      call: () => fetch(`${SERVER_URL}/api/auth/pending-users`).then(res => res.json())
    },
    {
      label: "GET /auth/approved-users",
      call: () => authorizedFetch(`${SERVER_URL}/api/auth/approved-users`).then(res => res.json())
    },
    {
      label: "GET /auth/denied-users",
      call: () => authorizedFetch(`${SERVER_URL}/api/auth/denied-users`).then(res => res.json())
    },
    {
      label: "GET /events/status/finished",
      call: () => authorizedFetch(`${SERVER_URL}/api/events/status/finished`).then(res => res.json())
    },
    {
      label: "GET /events/status/pending",
      call: () => authorizedFetch(`${SERVER_URL}/api/events/status/pending`).then(res => res.json())
    },
    {
      label: "GET /events/status/ongoing",
      call: () => authorizedFetch(`${SERVER_URL}/api/events/status/ongoing`).then(res => res.json())
    },
    {
      label: "PUT /auth/update-status/:idNumber",
      call: () =>
        authorizedFetch(`${SERVER_URL}/api/auth/update-status/${idNumber}`, {
          method: "PUT",
          body: JSON.stringify({ newStatus })
        }).then(res => res.json())
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>API Route Tester</Text>

      <TextInput style={styles.input} placeholder="Enter Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Enter User ID" value={userId} onChangeText={setUserId} />
      <TextInput style={styles.input} placeholder="Enter ID Number" value={idNumber} onChangeText={setIdNumber} />
      <TextInput style={styles.input} placeholder="New Status (approved / denied / pending)" value={newStatus} onChangeText={setNewStatus} />

      {routes.map(({ label, call }) => (
        <View key={label} style={styles.section}>
          <Button title={`Test ${label}`} onPress={() => testRoute(label, call)} />
          {results[label] && (
            <View style={styles.resultBox}>
              <Text style={{ color: results[label].success ? 'green' : 'red' }}>
                {results[label].success ? '✅ Success' : `❌ ${results[label].error}`}
              </Text>
              {results[label].data && (
                <Text style={styles.jsonBlock}>
                  {JSON.stringify(results[label].data, null, 2)}
                </Text>
              )}
            </View>
          )}
        </View>
      ))}

      <Button title="Load All Events" onPress={fetchAllEvents} color="purple" />

      {allEvents.map((event) => (
        <View key={event._id} style={styles.eventCard}>
          <TouchableOpacity onPress={() => setExpandedEventId(expandedEventId === event._id ? null : event._id)}>
            <Text style={styles.eventTitle}>{event.eventType} — {event.status}</Text>
            <Text style={styles.eventMeta}>{new Date(event.timestamp).toLocaleString()}</Text>
          </TouchableOpacity>

          {expandedEventId === event._id && (
            <View style={styles.buttonRow}>
              <Button title="Set Ongoing" onPress={() => updateEventStatus(event._id, "ongoing")} color="orange" />
              <Button title="Set Finished" onPress={() => updateEventStatus(event._id, "finished")} color="green" />
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#f9f9f9' },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  section: { marginBottom: 20 },
  resultBox: { marginTop: 10, backgroundColor: '#fff', padding: 10, borderRadius: 5 },
  jsonBlock: { fontSize: 12, color: '#333', marginTop: 5 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1
  },
  eventCard: {
    backgroundColor: '#ffffff',
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  eventMeta: {
    fontSize: 12,
    color: '#888'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  }
});

export default TestRoutesScreen;

import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authorizedFetch } from '../utils/Communication';

const SERVER_URL = "http://10.0.0.17:3001";

const TestRoutesScreen = () => {
  const [results, setResults] = useState({});
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [userId, setUserId] = useState("");

  const testRoute = async (label, fetchFunction) => {
    try {
      const data = await fetchFunction();
      setResults((prev) => ({ ...prev, [label]: { success: true, data } }));
    } catch (err) {
      setResults((prev) => ({ ...prev, [label]: { success: false, error: err.message } }));
    }
  };

  const routes = [
    {
      label: "GET /auth/healthcheck",
      call: () => fetch(`${SERVER_URL}/api/auth/healthcheck`).then(res => res.json())
    },
    {
      label: "GET /events (authorized)",
      call: () => authorizedFetch(`${SERVER_URL}/api/events`).then(res => res.json())
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
    
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>API Route Tester</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={userId}
        onChangeText={setUserId}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter ID Number"
        value={idNumber}
        onChangeText={setIdNumber}
      />

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
  }
});

export default TestRoutesScreen;

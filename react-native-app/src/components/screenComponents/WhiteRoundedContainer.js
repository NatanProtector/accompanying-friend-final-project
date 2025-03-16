import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

export default function WhiteRoundedContainer({ children }) {
  return (
    <View style={styles.container}>
      <View style={styles.whiteBox}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 8,  // Takes the remaining space
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  whiteBox: {
    flex: 1,  // Fills the available space
    backgroundColor: '#FEFEFE',
    padding: 20,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,  // Allows the ScrollView to expand if needed
    alignItems: 'center',
    justifyContent: 'center',  // Center content if it doesn't fill the screen
  },
});

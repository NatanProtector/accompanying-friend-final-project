import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

export default function WhiteRoundedContainer({ children }) {
  return (
    <View style={styles.container}>
      <View style={styles.whiteBox}>
        <View style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {children}
          </ScrollView>
        </View>
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
    // padding: 20,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    width: '100%',
  },
  scrollContainer: {
    width: '100%',
    height: '90%',
    // backgroundColor:'purple'

  },
  scrollContent: {
    alignItems: 'center',      // Centers horizontally
    justifyContent: 'flex-start',  // Sticks content to the top
    width: '100%',
    height: '100%',
  },
});

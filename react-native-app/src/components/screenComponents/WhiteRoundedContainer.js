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
    flex: 7.8,  
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  whiteBox: {
    flex: 1, 
    backgroundColor: '#FEFEFE',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    overflow: 'hidden',
  },
  scrollContainer: {
    width: '100%',
    height: '90%',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
});

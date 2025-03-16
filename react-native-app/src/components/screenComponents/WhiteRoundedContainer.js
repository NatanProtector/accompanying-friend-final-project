import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function WhiteRoundedContainer({ children }) {
  return (
    <View style={styles.container}>
      <View style={styles.whiteBox}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 8,  // Takes 80% of the height
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  whiteBox: {
    flex: 1,  // Ensures content fills the container properly
    backgroundColor: '#FEFEFE',
    padding: 20,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';

const BasicBlueScreen = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    backgroundColor: '#5664F7',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default BasicBlueScreen;

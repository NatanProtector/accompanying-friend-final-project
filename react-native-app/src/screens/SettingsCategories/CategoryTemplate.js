import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import defineTextAlignStyle from '../../utils/defineTextAlignStyle';
export default function CategoryTemplate({ title, children }) {

  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = () => setIsOpen(!isOpen);

  return (
    <View style={styles.categoryContainer}>
      {/* Category Header */}
      <TouchableOpacity onPress={toggleCategory} style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{title}</Text>
      </TouchableOpacity>

      {/* Category Content */}
      {isOpen && <View style={styles.categoryContent}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  categoryHeader: {
    backgroundColor: '#f0f0f0',
    padding: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryContent: {
    padding: 15,
    backgroundColor: '#fff',
  },
});

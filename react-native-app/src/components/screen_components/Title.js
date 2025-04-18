import { View, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import MyLanguageContext from '../../utils/MyLanguageContext';
import defineTextAlignStyle from '../../utils/defineTextAlignStyle';

export default function Title({ title, subtitle }) {
  const { language } = useContext(MyLanguageContext);
  const containerAlignment = language === 'en' ? 'flex-start' : 'flex-end'; // Align container based on language

  return (
    <View style={[styles.container, { alignItems: containerAlignment }]}>
      <Text style={defineTextAlignStyle(language, styles.title)}>{title}</Text>
      {subtitle && (
        <Text style={defineTextAlignStyle(language, styles.subtitle)}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FEFEFE',
    margin: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FEFEFE',
    margin: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 3,
  },
});

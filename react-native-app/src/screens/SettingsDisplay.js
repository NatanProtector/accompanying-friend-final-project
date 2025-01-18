import { View, Text, StyleSheet } from 'react-native';
import CategoryTemplate from './SettingsCategories/CategoryTemplate';
import { useContext } from 'react';
import MyLanguageContext from '../utils/MyLanguageContext';
import { Button } from 'react-native-elements';

export default function SettingsDisplay({ route, switchLanguage }) {
  const { language } = useContext(MyLanguageContext);
  const { role } = route.params || {}; // Get the Settings Display type (citizen/security)

  return (
    <View style={styles.container}>
      <CategoryTemplate title={settings_text_citizen_language_category[language].title}>
        <Button
          title="example1"
          onPress={() => { console.log("button 1 pressed") }}
          buttonStyle={styles.button}
        />
        <View style={styles.languageChangeContainer}>
          <Text style={styles.languageChangeText}>
            {settings_text_citizen_language_category[language].change}
          </Text>
          <Button
            title={settings_text_citizen_language_category[language].languageButton}
            onPress={switchLanguage}
            buttonStyle={styles.languageButton}
          />
        </View>
      </CategoryTemplate>
    </View>
  );
}

const settings_text_citizen_language_category = {
  en: {
    title: "Language",
    change: "Change Language: ",
    languageButton: "עברית",
  },
  he: {
    title: "שפה",
    change: "שנה שפה: ",
    languageButton: "english",
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#4CAF50', // Custom button color
  },
  languageChangeContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  languageChangeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  languageButton: {
    backgroundColor: '#2196F3', // Custom color for language switch button
  },
});

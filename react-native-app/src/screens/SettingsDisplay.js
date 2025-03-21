import { View, Text, StyleSheet } from 'react-native';
import CategoryTemplate from './SettingsCategories/CategoryTemplate';
import { useContext } from 'react';
import MyLanguageContext from '../utils/MyLanguageContext';
import { Button } from 'react-native-elements';

export default function SettingsDisplay({ route }) {
  const { language } = useContext(MyLanguageContext);
  const { role } = route.params || {}; // Get the Settings Display type (citizen/security)

  return (
    <View style={styles.container}>
      
      <Text style={{fontSize: 30, margin: 15}}>
        {settings_text[language].title}
      </Text>

      <CategoryTemplate title={settings_text[language].update}>

        <Text>
          {settings_text[language].msg}
        </Text>

      </CategoryTemplate>

    </View>
  );
}

const settings_text = {
  en: {
    title: "Settings",
    language_title: "Language",
    change: "Change Language: ",
    languageButton: "עברית",
    msg: "No settings for now",
    update: 'Update personal details'
  },
  he: {
    title: "הגדרות",
    language_title: "שפה",
    change: "שנה שפה: ",
    languageButton: "english",
    msg: "אין הגדרות בניתיים",
    update: 'עדכון פרטים אישיים'
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '80%',
    // content goes from the top to the bottom
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 18,
  }
});

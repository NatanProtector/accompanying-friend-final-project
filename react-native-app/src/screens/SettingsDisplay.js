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
      {/* <CategoryTemplate title={settings_text_citizen_language_category[language].title}> */}
        <Text style={styles.text} >{settings_text[language].msg}</Text>
        {/* <Button
          title={settings_text_citizen_language_category[language].languageButton}
          onPress={() => { console.log("pressed") }}
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
        </View> */}
      {/* </CategoryTemplate>  */}
    </View>
  );
}

const settings_text = {
  en: {
    title: "Language",
    change: "Change Language: ",
    languageButton: "עברית",
    msg: "No settings for now"
  },
  he: {
    title: "שפה",
    change: "שנה שפה: ",
    languageButton: "english",
    msg: "אין הגדרות בניתיים"
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
  },
  text: {
    fontSize: 18,
  }
});

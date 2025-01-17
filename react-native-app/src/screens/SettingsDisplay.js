import { View, Text } from 'react-native';
import CategoryTemplate from './SettingsCategories/CategoryTemplate';

import { useContext } from 'react';
import MyLanguageContext from '../utils/MyLanguageContext';
import { Button } from 'react-native-elements';

export default SettingsDisplay = ({route}) => {

    const { language } = useContext(MyLanguageContext);
    const { role } = route.params || {}; // Get the Settings Display type (citizen/security)

    return (
        <View>
            <CategoryTemplate title={"Category 1"}>
                <Button title="example1" onPress={() => {console.log("button 1 pressed")}} />
                <Button title="example2" onPress={() => {console.log("button 2 pressed")}} />
            </CategoryTemplate>
        </View>
    );
}
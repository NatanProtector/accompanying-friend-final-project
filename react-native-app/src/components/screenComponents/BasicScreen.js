import WhiteRoundedContainer from "./WhiteRoundedContainer";
import BasicBlueScreen from "./BasicBlueScreen";
import {View } from "react-native";
import TitleContainer from "./TitleContainer";
import Title from "./Title";

import BasicScreenTemplate from "./BasicScreenTemplate";

export default function BasicScreen({ children, title, language }) {
    return (
        <BasicScreenTemplate
            HeaderComponent={<Title title={title} subtitle={defaultSubtitle[language]} />}
        >
            {children}
        </BasicScreenTemplate>
    );
}

const defaultSubtitle = {
    en: 'Always with you - anywhere, anytime',
    he: 'תמיד איתך - בכל מקום, בכל שעה',
}
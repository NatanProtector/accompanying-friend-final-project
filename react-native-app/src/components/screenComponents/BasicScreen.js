import WhiteRoundedContainer from "./WhiteRoundedContainer";
import BasicBlueScreen from "./BasicBlueScreen";
import { Text, View } from "react-native";
import TitleContainer from "./TitleContainer";
import Title from "./Title";

export default function BasicScreen({ children, title,subtitle, language }) {
    return (
        <BasicBlueScreen>
            <View style={{ flex: 1, width: "100%" }}>
                <TitleContainer>
                    <Title
                        title={title}
                        subtitle={subtitle || defaultSubtitle[language]}
                    />
                </TitleContainer>
                <WhiteRoundedContainer>
                    {children}
                </WhiteRoundedContainer>
            </View>
        </BasicBlueScreen>
    );
}

const defaultSubtitle = {
    en: 'Always with you - anywhere, anytime',
    he: 'תמיד איתך - בכל מקום, בכל שעה',
}
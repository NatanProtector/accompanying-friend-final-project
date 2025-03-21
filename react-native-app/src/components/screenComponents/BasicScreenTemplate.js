import WhiteRoundedContainer from "./WhiteRoundedContainer";
import BasicBlueScreen from "./BasicBlueScreen";
import { View } from "react-native";
import TitleContainer from "./TitleContainer";

export default function BasicScreenTemplate({ children, HeaderComponent, FooterComponent }) {
    return (
        <BasicBlueScreen>
            <View style={{ flex: 1, width: "100%", borderTopLeftRadius: 45, borderTopRightRadius: 45, overflow: 'hidden' }}>
                <TitleContainer>
                    {/* Custom Navigation Component (optional) */}
                    {HeaderComponent}

                </TitleContainer>

                <WhiteRoundedContainer>

                    {children}

                </WhiteRoundedContainer>

            </View>

            {FooterComponent}

        </BasicBlueScreen>
    );
}

const defaultSubtitle = {
    en: 'Always with you - anywhere, anytime',
    he: 'תמיד איתך - בכל מקום, בכל שעה',
};

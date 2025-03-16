import WhiteRoundedContainer from "./WhiteRoundedContainer";
import BasicBlueScreen from "./BasicBlueScreen";
import { Text, View } from "react-native";
import TitleContainer from "./TitleContainer";
import Title from "./Title";

export default function BasicScreen({ children, title,subtitle }) {
    return (
        <BasicBlueScreen>
            <View style={{ flex: 1, width: "100%" }}>
                <TitleContainer>
                    <Title
                        title={title}
                        subtitle={subtitle}
                    />
                </TitleContainer>
                <WhiteRoundedContainer>
                    {children}
                </WhiteRoundedContainer>
            </View>
        </BasicBlueScreen>
    );
}

import WhiteRoundedContainer from "./WhiteRoundedContainer";
import BasicBlueScreen from "./BasicBlueScreen";
import { View } from "react-native";
import TitleContainer from "./TitleContainer";

export default function BasicScreenTemplate({ children, HeaderComponent, FooterComponent }) {
    return (
        <BasicBlueScreen>
            <View style={{ flex: 1, width: "100%",}}>
                <TitleContainer>

                    {HeaderComponent}

                </TitleContainer>

                <WhiteRoundedContainer
                    FooterComponent={FooterComponent}>

                    {children}

                </WhiteRoundedContainer>

            </View>

        </BasicBlueScreen>
    );
}
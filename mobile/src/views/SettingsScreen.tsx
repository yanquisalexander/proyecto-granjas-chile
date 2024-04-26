import { Emote } from "@/components/Emote";
import SectionHeader from "@/components/SectionHeader";
import LoggedUserCard from "@/components/settings/LoggedUserCard";
import SettingList from "@/components/settings/SettingList";
import { Emotes } from "@/emotes";
import { useAuth } from "@/providers/AuthContext";
import { Theme } from "@/theme";
import { StyleSheet } from "react-native";
import { Button, Div, Icon, ScrollDiv, Text } from "react-native-magnus";



const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.BACKGROUND_COLOR,
        flex: 1,
    },
});

const SettingsScreen = () => {
    const { logout } = useAuth();
    return (
        <Div style={styles.container}>
            <SectionHeader>
                <Text fontSize="2xl" fontWeight="bold">
                    Configuración <Emote value={Emotes.WRENCH} />
                </Text>
            </SectionHeader>
            <ScrollDiv style={{ paddingHorizontal: 16 }} py={8}>
                <LoggedUserCard />
                <Div my={4} />
                <SettingList />
                <Div my={4} />
                <Div bg="white" p="lg" rounded="md" justifyContent="center" row>
                    <Text
                    >
                        Los cambios realizados en la configuración solamente se aplican a tu dispositivo.
                    </Text>
                </Div>
            </ScrollDiv>
        </Div>
    );
}

export default SettingsScreen;
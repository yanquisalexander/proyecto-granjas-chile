import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from "@/providers/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, Image, ScrollDiv, Div } from "react-native-magnus";
import { Emotes } from "@/emotes";
import { JSONText } from "@/components/JSONText";
import { Emote } from "@/components/Emote";
import { NoEnterpriseAsigned } from "@/components/home/NoEnterpriseAsigned";
import { MyEnterprise } from "@/components/home/MyEnterprise";


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
    },
});

const HomeScreen = () => {
    const { authState } = useAuth();
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text fontSize="2xl" fontWeight="bold" py={16} px={16}>
                Formularios a completar <Emote value={Emotes.TRACTOR} />
            </Text>
            <ScrollDiv style={{ paddingHorizontal: 16 }} py={8}>
                <Div>
                    {
                        !authState || !authState.user || !authState.user.enterprise ? (
                            <NoEnterpriseAsigned />
                        ) : (
                            <>
                                <MyEnterprise />
                                <JSONText text={authState.user} />
                            </>
                        )
                    }
                </Div>
            </ScrollDiv>
        </View>
    );
}

export default HomeScreen;

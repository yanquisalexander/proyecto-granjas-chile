import { useAuth } from "@/providers/AuthContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Div, Icon, Text } from "react-native-magnus";
import { Emote } from "../Emote";
import { Emotes } from "@/emotes";
import { Constants } from "@/constants";
import { JSONText } from "../JSONText";

export const MyEnterprise = () => {
    const { authState, reloadUser } = useAuth();
    return (
        <Div bg="blue200" p={8} rounded="md">
            <Text>
                Hola, <Text fontWeight="bold">{authState.user.username} ({authState?.user?.email})</Text> <Emote size={20} value={Emotes.WAVING_HAND} />
            </Text>
            <Text>
                Actualmente estás asignado a la empresa <Text fontWeight="bold">{authState.user.enterprise.name}</Text>
            </Text>
            {
                Constants.DEBUG_ENABLED && (
                    <>
                        <Text mt={8}>
                            <Text fontWeight="bold">⚠️ DEBUG ENTERPRISE INFO:</Text>
                        </Text>
                        <JSONText text={authState.user.enterprise} />
                    </>
                )
            }
        </Div>
    );
}
import { useAuth } from "@/providers/AuthContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Div, Icon, Text } from "react-native-magnus";


export const NoEnterpriseAsigned = () => {
    const { authState, reloadUser } = useAuth();
    return (
        <Div bg="orange100" p={8} rounded="md">
            <Text color="orange600">
                El usuario <Text color="orange600" fontWeight="bold">{authState.user.username} ({authState?.user?.email}</Text>) no tiene una empresa asignada.
            </Text>
            <Text color="orange600">
                Por favor, contacte al administrador del sistema.
            </Text>

            <Button mt={16} bg="orange600" fontSize={12} p={8} loading={authState.loadingUser} onPress={() => {
                reloadUser()
            }}
                prefix={
                    <Icon name="refresh-cw" color="white" mr={8} fontFamily="Feather" fontSize="xl" />
                }>
                Volver a cargar
            </Button>
        </Div>
    );
}
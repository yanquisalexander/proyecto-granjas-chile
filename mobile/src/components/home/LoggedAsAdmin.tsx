import React from "react";
import { StyleSheet } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useAuth } from "@/providers/AuthContext";
import { Feather } from "@expo/vector-icons";

const LoggedAsAdmin = () => {
    const { authState } = useAuth();
    const adminRoles = ["admin", "super_admin"];

    return (
        authState && authState.user && authState.user.roles && authState.user.roles.some((role: { name: string; }) => adminRoles.includes(role.name)) ? (
            <Div bg="orange200" p={8}>
                <Text color="orange800" textAlign="center">
                    Has iniciado sesión como administrador
                </Text>
            </Div>
        ) : null
    );
};

export default LoggedAsAdmin;

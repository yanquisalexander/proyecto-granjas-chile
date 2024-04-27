import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Div, Icon, Text } from "react-native-magnus";


export const FormLocked = () => {
    return (
        <Div bg="orange100" p={8} rounded="md">
            <Text color="orange600">
                Un administrador ha modificado este formulario.
            </Text>
            <Text color="orange600">
                Por seguridad, debes abrirlo nuevamente para continuar.
            </Text>
        </Div>
    );
}
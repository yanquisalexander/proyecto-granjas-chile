import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Div, Icon, Text } from "react-native-magnus";


export const FormWithoutSteps = () => {
    return (
        <Div bg="blue100" p={8} rounded="md">
            <Text color="blue600">
                Este formulario no tiene pasos para completar
            </Text>
            <Text color="blue600">
                Vuelva a intentar más tarde
            </Text>

        </Div>
    );
}
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Div, Icon, Text } from "react-native-magnus";


export const SavingLocally = () => {
    const [animatedDot, setAnimatedDot] = useState(0);

    setTimeout(() => {
        setAnimatedDot((animatedDot + 1) % 4);
    }, 500);

    return (
        <Div bg="blue100" p={8} rounded="md" alignItems="center" justifyContent="center" row>
            <Icon name="edit" fontFamily="Feather" fontSize="xl" color="blue600" mr={4} />

            <Text color="blue600">
                Guardando cambios {Array(animatedDot).fill(".").join("")}
            </Text>

        </Div>
    );
}
import React from "react"
import { Text } from "react-native-magnus"

export const JSONText = ({ text }: { text: any }) => {
    return (
        <Text style={{ fontFamily: "Inter_400Regular" }}>{JSON.stringify(text, null, 2)}</Text>
    )
}
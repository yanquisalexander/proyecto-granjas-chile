import React from "react";
import { Image } from "react-native-magnus";

export const Emote = ({ value, size = 24 }: { value: any, size?: number }) => {
    return <Image style={{ width: size, height: size }} source={value} />
}
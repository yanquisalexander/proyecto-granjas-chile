import { useCallback, useEffect } from 'react';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { Inter_400Regular } from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

export const FontProvider = ({ children }: any) => {
    const [fontsLoaded, fontError] = useFonts({
        Inter_400Regular
    })

    useEffect(() => {
        if (fontsLoaded) {
            console.log("Fonts loaded: ", fontsLoaded);
        }
    }, [fontsLoaded]);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            {children}
        </View>
    )
}
import * as React from 'react';
import { Text, Button } from 'react-native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/providers/AuthContext";
import LoginScreen from "@/views/auth/LoginScreen";
import HomeScreen from "@/views/HomeScreen";
import { MainLayout } from "@/views/layouts/MainLayout";

const Stack = createNativeStackNavigator();


export const StackNavigator = () => {
    const { authState } = useAuth()
    return (
        <Stack.Navigator
            initialRouteName={authState?.authenticated ? "Main" : "Login"}
            screenOptions={{
                animation: 'slide_from_right',
                presentation: 'modal',
                headerShown: false,
            }}>
            {
                authState?.authenticated ? (
                    <Stack.Screen name="Main" component={MainLayout} />
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )
            }
        </Stack.Navigator>
    );
}
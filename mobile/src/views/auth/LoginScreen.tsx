import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet } from "react-native";
import { Div, Text, Image, Input, Button, Checkbox, Overlay } from "react-native-magnus";
// @ts-expect-error - no type definitions available for assets
import LoginImage from "@/assets/images/login.png";
import { Constants } from "@/constants";
import { useAuth } from "@/providers/AuthContext";

// Define styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

const LoginScreen = () => {
    // Destructuring Constants
    const { APPLICATION_NAME, LOGO_PATH } = Constants;
    const screenWidth = Dimensions.get("screen").width;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginIn, setLoginIn] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useAuth();
    const [error, setError] = useState("");

    // Function to check if LOGO_PATH is a valid URL
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleLogin = async () => {
        if (!email) {
            Alert.alert("Error", "El correo electrónico es requerido")
            return
        }
        if (!password) {
            Alert.alert("Error", "La contraseña es requerida")
            return
        }

        setLoginIn(true)
        try {
            await login(email, password)
        } catch (error) {
            setLoginIn(false)
        }
    }


    // Determine the image source based on LOGO_PATH
    const imageSource = LOGO_PATH && isValidUrl(LOGO_PATH) ? { uri: LOGO_PATH } : LoginImage;

    return (
        <Div style={styles.container}>
            <Text fontSize="2xl" fontFamily="Inter_400Regular">
                {APPLICATION_NAME}
            </Text>
            <Image
                h={300}
                w={screenWidth - 10}
                resizeMode="contain"
                source={imageSource}
            />

            <Div style={{ gap: 16, marginBottom: 32 }}>
                <Text fontSize="md">
                    Inicie sesión en su cuenta para continuar
                </Text>
            </Div>

            <Div style={{ width: "80%", gap: 16 }}>
                <Input
                    placeholder="E-mail"
                    onChangeText={(email) => {
                        setEmail(email)
                    }} />
                <Input
                    placeholder="Contraseña"
                    secureTextEntry={!showPassword}
                    onChangeText={(pass) => {
                        setPassword(pass)
                    }}
                />

                <Checkbox onChecked={(checked) => {
                    console.log(checked)
                    setShowPassword(checked)
                }}
                >
                    <Text>Mostrar contraseña</Text>
                </Checkbox>

                <Button bg="green300" fontFamily="Inter_400Regular" color="green900" loading={loginIn} onPress={handleLogin}>
                    Iniciar sesión
                </Button>
            </Div>
            <Overlay visible={loginIn} p="xl">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text fontSize="xl" textAlign="center">Iniciando sesión...</Text>
            </Overlay>
        </Div>
    );
};

export default LoginScreen;

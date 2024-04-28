import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Div, Text } from "react-native-magnus";
import { Constants } from "@/constants";
import { NavigationContainer } from "@react-navigation/native";
import { StackNavigator } from "@/router";
import { AuthProvider } from "@/providers/AuthContext";
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { FontProvider } from "@/providers/FontProvider";
import { SettingsProvider } from "@/providers/SettingsProvider";
import { Theme } from "@/theme";
import { LocalDraftsProvider } from "@/providers/LocalDraftsProvider";
import FlashMessage from "react-native-flash-message";


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SettingsProvider>
        <FontProvider>
          <AuthProvider>
            <LocalDraftsProvider>
              <NavigationContainer
                onReady={() => console.log('App is ready!')}>
                <StackNavigator />
              </NavigationContainer>
            </LocalDraftsProvider>
          </AuthProvider>
        </FontProvider>
      </SettingsProvider>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.BACKGROUND_COLOR,
    flex: 1,
  },
});

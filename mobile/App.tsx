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

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <FontProvider>
        <AuthProvider>
          <NavigationContainer
            onReady={() => console.log('App is ready!')}>
            <StackNavigator />
          </NavigationContainer>
        </AuthProvider>
      </FontProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

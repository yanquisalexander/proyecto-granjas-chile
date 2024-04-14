import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "@/views/HomeScreen";
import Feather from "@expo/vector-icons/Feather";
import LoggedAsAdmin from "@/components/home/LoggedAsAdmin";
import SettingsScreen from "../SettingsScreen";

const Tab = createBottomTabNavigator();

export const MainLayout = () => {
    return (
        <>
            <LoggedAsAdmin />
            <Tab.Navigator

                screenOptions={{
                    headerShown: false,
                    lazy: false
                }}>
                <Tab.Screen name="Home" component={HomeScreen} options={{
                    title: "Formularios",
                    tabBarIcon: ({ color }) => (
                        <Feather name="grid" size={24} color={color} />
                    )
                }}
                />

                <Tab.Screen name="Notifications" component={HomeScreen} options={{
                    title: "Notificaciones",
                    tabBarIcon: ({ color }) => (
                        <Feather name="bell" size={24} color={color} />
                    )
                }}
                />

                <Tab.Screen name="Settings" component={SettingsScreen} options={{
                    title: "Configuración",
                    tabBarIcon: ({ color }) => (
                        <Feather name="settings" size={24} color={color} />
                    )
                }}
                />
            </Tab.Navigator>
        </>
    );
}
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "@/views/HomeScreen";
import Feather from "@expo/vector-icons/Feather";

const Tab = createBottomTabNavigator();

export const MainLayout = () => {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{
                title: "Formularios",
                tabBarIcon: ({ color }) => (
                    <Feather name="grid" size={24} color={color} />
                )
            }}
            />
        </Tab.Navigator>
    );
}
import { useAuth } from "@/providers/AuthContext";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";

const LoggedUserCard = () => {
    const { authState, logout } = useAuth();

    const calculateMD5 = (email: string) => {
        const md5 = require('md5');
        return md5(email.trim().toLowerCase());
    }
    return (
        <Div bg="white" p="lg" rounded="md" alignItems="center">
            <Image
                h={56}
                w={56}
                rounded="circle"
                borderColor="gray600"
                borderWidth={2}
                source={{ uri: `https://www.gravatar.com/avatar/${calculateMD5(authState.user?.email)}?d=identicon` }} />
            <Text fontSize="xl" fontWeight="bold" pt={16}>
                {
                    authState.user?.name || authState.user?.username
                }
            </Text>
            <Text fontSize="md" color="gray600">
                {authState.user?.email}
            </Text>

            <Div mt={16}>
                <Button bg="red100" color="red500" fontFamily="Inter_500Medium" onPress={logout}
                    prefix={
                        <Icon name="log-out" mr={8} fontFamily="Feather" fontSize="xl" color="red500" />
                    }>
                    Cerrar sesión
                </Button>
            </Div>
        </Div>
    );
}

export default LoggedUserCard;
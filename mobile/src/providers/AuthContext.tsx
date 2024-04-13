import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { Constants } from "@/constants";
import { Alert } from "react-native";
const { BACKEND_URL } = Constants;

interface AuthState {
    token: string | null;
    authenticated: boolean | null;
    user: any | null;
    loadingUser: boolean;
}


interface AuthContextType {
    authState: AuthState;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    authState: { token: null, authenticated: null, user: null, loadingUser: false },
    login: async () => { },
    logout: async () => { },
    reloadUser: async () => { },
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        authenticated: null,
        user: null,
        loadingUser: false,
    });

    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                setAuthState(prevState => ({ ...prevState, loadingUser: true })); // Establecemos loadingUser en true
                const token = await SecureStore.getItemAsync("token");
                if (token) {
                    const user = await getCurrentUser(token);
                    setAuthState({ token, authenticated: true, user, loadingUser: false }); // Establecemos loadingUser en false después de obtener el usuario
                } else {
                    setAuthState({ token: null, authenticated: false, user: null, loadingUser: false }); // Establecemos loadingUser en false si no hay token
                }
            } catch (error) {
                handleAuthError(error);
            }
        };

        checkCurrentUser();
    }, []);


    const getCurrentUser = async (token: string) => {
        const response = await axios.get(`${BACKEND_URL}/accounts/current_user`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    };

    const handleAuthError = (error: any) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
            // Handle unauthorized error
            logout();
            Alert.alert("Sesión expirada", "Parece que tu sesión ha expirado, por favor inicia sesión nuevamente");
        } else {
            // Handle other errors
            console.error(error);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/accounts/login`, { email, password }, {
                timeout: 5000,
                timeoutErrorMessage: "Hubo un problema al iniciar sesión",
            });
            const { access_token } = response.data;
            await SecureStore.setItemAsync("token", access_token);
            const user = await getCurrentUser(access_token);
            setAuthState({ token: access_token, authenticated: true, user, loadingUser: false });
        } catch (error) {
            Alert.alert("Error al iniciar sesión", "Verifica tus credenciales e intenta nuevamente");
            setAuthState({ token: null, authenticated: false, user: null, loadingUser: false });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync("token");
            setAuthState({ token: null, authenticated: false, user: null, loadingUser: false });
        } catch (error) {
            console.error(error);
        }
    };

    const reloadUser = async () => {
        console.log("Reloading user");
        setAuthState(prevState => ({ ...prevState, loadingUser: true }));
        try {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                const user = await getCurrentUser(token);
                setAuthState({ token, authenticated: true, user, loadingUser: false });
            } else {
                setAuthState({ token: null, authenticated: false, user: null, loadingUser: false });
            }
        } catch (error) {
            handleAuthError(error);
        }
    }

    return (
        <AuthContext.Provider value={{ authState, login, logout, reloadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

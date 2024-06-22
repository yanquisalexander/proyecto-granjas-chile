import axios from "axios";

export const useAuthenticatedRequest = () => {
    const runtimeConfig = useRuntimeConfig();
    const { token } = useAuth();
    const axiosInstance = axios.create({
        baseURL: runtimeConfig.public.backendURL as string || 'http://localhost:3000',
        headers: {
            Authorization: token.value,
        }
    });

    return axiosInstance;
}
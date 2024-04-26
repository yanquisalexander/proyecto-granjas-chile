import axios from "axios";
import { Configuration } from "~/config";

export const useAuthenticatedRequest = () => {
    const { token } = useAuth();
    const axiosInstance = axios.create({
        baseURL: Configuration.BACKEND_URL,
        headers: {
            Authorization: token.value,
        }
    });

    return axiosInstance;
}
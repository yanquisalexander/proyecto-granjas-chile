import { Constants } from "@/constants";

export const formServices = () => {
    const getForm = async (formId: string) => {
        const response = await fetch(`${Constants.BACKEND_URL}/forms/${formId}`);
        return await response.json();
    };
    
    return {
        getForm,
    };
}
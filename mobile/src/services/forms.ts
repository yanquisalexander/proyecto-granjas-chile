import { Constants } from "@/constants";
import { FieldOptions } from "@/types";

export const formServices = () => {
    const getForm = async (formId: string): Promise<any> => {
        const response = await fetch(`${Constants.BACKEND_URL}/forms/${formId}`);
        return await response.json();
    };

    const normalizedFieldOptions = (fieldOptions: any): FieldOptions => {
        if (typeof fieldOptions === "string") {
            try {
                fieldOptions = JSON.parse(fieldOptions);
            } catch (error) {
                console.error("Error al parsear opciones de campo", error);
                return {};
            }
        }

        if (!fieldOptions) {
            return {};
        }

        const { choices, maxLength, minLength, maxImages, maxFiles, format } = fieldOptions;

        // Validar maxLength y minLength
        if (typeof maxLength === "number" && typeof minLength === "number") {
            if (maxLength < minLength) {
                return {
                    choices: Array.isArray(choices) ? choices : undefined,
                    maxLength: undefined,
                    minLength: undefined,
                    maxImages: typeof maxImages === "number" ? maxImages : undefined,
                    maxFiles: typeof maxFiles === "number" ? maxFiles : undefined,
                    format: typeof format === "string" ? format : undefined,
                };
            }
        }

        // Devolver opciones normalizadas
        return {
            choices: Array.isArray(choices) ? choices : undefined,
            maxLength: typeof maxLength === "number" ? maxLength : undefined,
            minLength: typeof minLength === "number" ? minLength : undefined,
            maxImages: typeof maxImages === "number" ? maxImages : undefined,
            maxFiles: typeof maxFiles === "number" ? maxFiles : undefined,
            format: typeof format === "string" ? format : undefined,
        };
    }
    
    return {
        getForm,
        normalizedFieldOptions,
    };
}

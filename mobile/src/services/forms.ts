import { Constants } from "@/constants";
import { FieldOptions } from "@/types";

export const formServices = () => {
    const getForm = async (formId: string): Promise<any> => {
        try {
            const response = await fetch(`${Constants.BACKEND_URL}/forms/${formId}`);
            return await response.json();
        } catch (error) {
            console.error("Error al obtener el formulario:", error);
            throw error; // Propagar el error para que el código que llame a esta función pueda manejarlo
        }
    };

    const normalizedFieldOptions = (fieldOptions = {} as FieldOptions): FieldOptions => {
        try {
            if (typeof fieldOptions === "string") {
                fieldOptions = JSON.parse(fieldOptions);
            }
        } catch (error) {
            console.error("Error al parsear opciones de campo:", error);
            return {}; // Devolver un objeto vacío en caso de error
        }
    
        if (!fieldOptions) {
            return {};
        }
    
        // Validar maxLength y minLength
        if (typeof fieldOptions.maxLength === "number" && typeof fieldOptions.minLength === "number") {
            if (fieldOptions.maxLength <= fieldOptions.minLength) {
                console.warn("El valor de maxLength es menor o igual que el valor de minLength. Se omiten estas restricciones.");
                fieldOptions.maxLength = undefined;
                fieldOptions.minLength = undefined;
            }
        }
    
        // Validar min y max
        if (typeof fieldOptions.min === "number" && typeof fieldOptions.max === "number") {
            if (fieldOptions.max < fieldOptions.min) {
                console.warn("El valor de max es menor que el valor de min. Se omiten estas restricciones.");
                fieldOptions.min = undefined;
                fieldOptions.max = undefined;
            }
        }
    
        // Ignorar maxLength si es 0
        if (typeof fieldOptions.maxLength === "number" && fieldOptions.maxLength === 0) {
            fieldOptions.maxLength = undefined;
        }
    
        // Devolver opciones normalizadas
        return {
            choices: Array.isArray(fieldOptions.choices) ? fieldOptions.choices : undefined,
            maxLength: typeof fieldOptions.maxLength === "number" ? fieldOptions.maxLength : undefined,
            minLength: typeof fieldOptions.minLength === "number" ? fieldOptions.minLength : undefined,
            maxImages: typeof fieldOptions.maxImages === "number" ? fieldOptions.maxImages : 1,
            maxFiles: typeof fieldOptions.maxFiles === "number" ? fieldOptions.maxFiles : undefined,
            format: typeof fieldOptions.format === "string" ? fieldOptions.format : undefined,
            min: typeof fieldOptions.min === "number" ? fieldOptions.min : undefined,
            max: typeof fieldOptions.max === "number" ? fieldOptions.max : undefined,
        };
    };
    
    
    return {
        getForm,
        normalizedFieldOptions,
    };
};

import { Div, Text, Input } from "react-native-magnus";
import { ShortText } from "./fields/ShortText";
import { YesNo } from "./fields/YesNo";
import { formServices } from "@/services/forms";

export const FormField = ({ field, updateFieldValue, isFormLocked, formDraft }: { field: any, updateFieldValue: Function, isFormLocked: boolean, formDraft: any }) => {

    const {
        field_name,
        description,
        field_type,
        options
    } = field

    const { normalizedFieldOptions } = formServices();

    const COMPONENT_MAP: any = {
        "short_text": ShortText,
        "yes_no": YesNo,
    }

    const Component = COMPONENT_MAP[field_type];

    const normalizedOptions = normalizedFieldOptions(options);

    return (
        <Div my={16}>
            <Text fontSize="md" fontWeight="500">
                {field_name}
                {
                    field.required && <Text color="red600">*</Text>
                }
            </Text>

            {
                description && <Text mb={8}>{description}</Text>
            }
            {
                Component ? <Component field={field} updateFieldValue={updateFieldValue} isFormLocked={isFormLocked} formDraft={formDraft} options={normalizedOptions} />
                    : <Div my={4} p={8} bg="red100">
                        <Text color="red600">
                            Tipo de campo no soportado
                        </Text>
                    </Div>
            }

        </Div>
    );
}
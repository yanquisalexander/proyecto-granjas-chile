import { Div, Text, Input } from "react-native-magnus";
import { ShortText } from "./fields/ShortText";
import { YesNo } from "./fields/YesNo";

export const FormField = ({ field, updateFieldValue, isFormLocked, formDraft }: { field: any, updateFieldValue: Function, isFormLocked: boolean, formDraft: any }) => {

    const {
        field_name,
        field_type,
    } = field

    const COMPONENT_MAP: any = {
        "short_text": ShortText,
        "yes_no": YesNo,
    }

    const Component = COMPONENT_MAP[field_type];
    return (
        <Div my={16}>
            <Text>{field_name}</Text>
            {
                Component ? <Component field={field} updateFieldValue={updateFieldValue} isFormLocked={isFormLocked} formDraft={formDraft} />
                    : <Div my={4} p={8} bg="red100">
                        <Text color="red600">
                            Tipo de campo no soportado
                        </Text>
                    </Div>
            }

        </Div>
    );
}
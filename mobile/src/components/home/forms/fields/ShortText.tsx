import { Input } from "react-native-magnus";

export const ShortText = ({ field, updateFieldValue, isFormLocked, formDraft }: { field: any, updateFieldValue: Function, isFormLocked: boolean, formDraft: any }) => {
    const {
        field_name,
        options,
        conditions,
        required,
        field_type,
    } = field
    return (

        <Input
            value={formDraft[field.id]}
            placeholder={field_name}
            editable={!isFormLocked}

            onChangeText={(value) => {
                if (isFormLocked) {
                    console.log("Formulario bloqueado, no se puede editar");
                    return;
                }
                updateFieldValue(field.id, value);
            }}
        />
    );
}
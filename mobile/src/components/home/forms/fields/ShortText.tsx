import { Input, Text } from "react-native-magnus";
import { type FieldOptions } from "@/types";

export const ShortText = ({ field, updateFieldValue, isFormLocked, formDraft, options }: { field: any, updateFieldValue: Function, isFormLocked: boolean, formDraft: any, options: FieldOptions }) => {
    const {
        field_name,
        conditions,
        required,
        field_type,
    } = field
    return (
        <>
            <Input
                value={formDraft[field.id]}
                placeholder={field_name}
                editable={!isFormLocked}
                maxLength={options.maxLength}
                onChangeText={(text) => updateFieldValue(field.id, text)}
            />
            {options.maxLength && (
                <Text fontSize="sm" flex={1} ml="auto" mr={4} mt={4} color={formDraft[field.id]?.length >= options.maxLength ? "red600" : "gray600"}>
                    {formDraft[field.id]?.length || 0} / {options.maxLength}
                </Text>
            )}
        </>
    );
};
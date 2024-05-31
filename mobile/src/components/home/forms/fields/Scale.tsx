import { Div, Text } from "react-native-magnus";
import Slider from '@react-native-community/slider';
import { type FieldOptions } from "@/types";

export const Scale = ({ field, updateFieldValue, isFormLocked, formDraft, options }: { field: any, updateFieldValue: Function, isFormLocked: boolean, formDraft: any, options: FieldOptions }) => {
    const {
        field_name,
        conditions,
        required,
        field_type,
    } = field
    return (
        <>
            <Slider
                style={{ height: 40 }}
                minimumValue={options.min}
                maximumValue={options.max}
                step={1}
                value={formDraft[field.id]}
                onValueChange={(value) => updateFieldValue(field.id, value)}
            />
            <Div row justifyContent="space-between" mt={4} px={4}>
                <Text fontSize="sm" ml={4}>
                    {options.min ? options.min : 0}
                </Text>

                <Text fontSize="sm" color="gray600">
                    {formDraft[field.id] ? formDraft[field.id] : 0}
                </Text>

                <Text fontSize="sm" mr={4}>
                    {options.max ? options.max : 10}
                </Text>
            </Div>
        </>
    );
};
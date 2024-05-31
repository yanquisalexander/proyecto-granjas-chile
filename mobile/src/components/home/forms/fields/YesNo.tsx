import React, { useEffect, useState } from 'react';
import { Toggle, Div, Text } from "react-native-magnus";
import { type FieldOptions } from "@/types";

export const YesNo = ({ field, updateFieldValue, isFormLocked, formDraft, options }: { field: any, updateFieldValue: Function, isFormLocked: boolean, formDraft: any, options: FieldOptions }) => {
    const {
        field_name,
        conditions,
        required,
        field_type,
    } = field;

    const [isCheck, setIsCheck] = useState(false);

    const handleChecked = (value: boolean) => {
        setIsCheck(value);
        updateFieldValue(field.id, value);
    }

    useEffect(() => {
        if (formDraft[field.id]) {
            console.log(`Setting value for ${field.id} to ${formDraft[field.id]}`);
            setIsCheck(formDraft[field.id]);
        }
    }, [formDraft[field.id]]);


    return (
        <Div mt={8} flex={1} row>
            <Toggle
                on={isCheck}
                disabled={isFormLocked}
                onPress={() => handleChecked(!isCheck)}
                bg="gray200"
                circleBg="white"
                activeBg="green500"
                h={30}
                w={60}
            />
            <Text ml={8}>{isCheck ? "Sí" : "No"}</Text>
        </Div>
    );
};

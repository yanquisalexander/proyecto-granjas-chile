import React, { useEffect, useState } from 'react';
import { Toggle, Div, Text } from "react-native-magnus";

export const YesNo = ({ field, updateFieldValue, isFormLocked, formDraft }: { field: any, updateFieldValue: Function, isFormLocked: boolean, formDraft: any }) => {
    const {
        field_name,
        options,
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

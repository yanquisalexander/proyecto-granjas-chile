import React, { useState } from 'react';
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


    return (
        <Div mt={16} flex={1} row>
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

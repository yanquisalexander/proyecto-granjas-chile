import React from 'react';
import { ScrollView } from 'react-native';
import { Settings, useSettings } from "@/providers/SettingsProvider";
import Setting from "./Setting";
import { Div, ScrollDiv } from "react-native-magnus";

const SettingList = () => {
    const { settings, updateSetting } = useSettings();

    // Función para manejar el cambio de ajustes
    const handleChange = (settingKey: keyof Settings, value: boolean | string) => {
        updateSetting(settingKey, value);
    };

    // Obtener las claves de los ajustes
    const settingKeys = Object.keys(settings) as (keyof Settings)[];

    return (
        <ScrollDiv bg="white" rounded="md">
            {settingKeys.map((key, index) => (
                <React.Fragment key={key}>
                    <Setting settingKey={key} value={settings[key]} onChange={handleChange} />
                    {
                        // Agregar un divisor si no es el último ajuste
                        index !== settingKeys.length - 1 && <Div bg="gray200" h={1} my={2} />
                    }
                </React.Fragment>
            ))}
        </ScrollDiv>
    );
}

export default SettingList;

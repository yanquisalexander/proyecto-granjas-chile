import { Settings, useSettings } from "@/providers/SettingsProvider";
import { Div, Text, Button, Toggle } from "react-native-magnus";

const SETTING_I18N: { [key: string]: string } = {
    darkMode: 'Modo oscuro',
    notifications: 'Notificaciones',
    keep_logged_in: 'Mantener la sesión iniciada',
};

const settingName = (key: keyof Settings) => SETTING_I18N[key] || `Missing translation for "${key}"`;


const Setting = ({ settingKey, value, onChange }: { settingKey: keyof Settings, value: boolean, onChange: (settingKey: keyof Settings, value: boolean) => void }) => {
    const { settings } = useSettings();



    // Compute the setting type
    // @ts-ignore
    const settingType = typeof settings[settingKey];

    // Renderizar un componente diferente según el tipo de ajuste
    const renderInput = () => {
        if (settingType === 'boolean') {
            return (
                <Toggle bg="gray500"
                    circleBg="white"
                    activeBg="indigo500"
                    on={value} onPress={() => onChange(settingKey, !value)} />
            );
        } else {
            // Renderizar otro tipo de componente para otros tipos de ajustes
            return (
                <Text>{value}</Text>
            );
        }
    };

    return (
        <Div row py={8} px={16} alignItems="center">
            <Text fontSize="lg" flex={1}>{
                settingName(settingKey)
            }</Text>
            {renderInput()}
        </Div>
    );
}

export default Setting;
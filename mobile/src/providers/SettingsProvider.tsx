import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definimos el tipo para los ajustes
export interface Settings {
    keep_logged_in: boolean;
    save_drafts_local: boolean;
}

// Lista de ajustes predefinidos
const defaultSettings: Settings = {
    keep_logged_in: false,
    save_drafts_local: true,
};

// Creamos un contexto para los ajustes
const SettingsContext = createContext<{
    settings: Settings;
    updateSetting: (key: keyof Settings, value: boolean | string) => void;
    getSetting: (key: keyof Settings) => boolean | string;
    resetSettings: () => void;
}>({
    settings: defaultSettings,
    updateSetting: () => { },
    getSetting: () => false,
    resetSettings: () => { },
});

// Hook personalizado para manejar los ajustes
export const useSettings = () => useContext(SettingsContext);

// Proveedor de contexto para los ajustes
export const SettingsProvider = ({ children }: any) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    // Cargar los ajustes almacenados al inicio
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedSettings = await AsyncStorage.getItem('settings');
                if (storedSettings) {
                    const parsedSettings = JSON.parse(storedSettings);
                    // Filtrar los ajustes almacenados para mantener solo aquellos presentes en la configuración predeterminada
                    const filteredSettings: Settings = Object.keys(defaultSettings)
                        .reduce((obj, key) => {
                            if (parsedSettings.hasOwnProperty(key)) {
                                obj[key as keyof Settings] = parsedSettings[key];
                            } else {
                                // Si no se encuentra el ajuste en los ajustes almacenados, se utiliza el valor predeterminado
                                obj[key as keyof Settings] = defaultSettings[key as keyof Settings];
                            }
                            return obj;
                        }, {} as Settings);
                    setSettings(filteredSettings);
                }
            } catch (error) {
                console.error('Error al cargar los ajustes:', error);
            }
        };



        loadSettings();
    }, []);

    // Función para actualizar un ajuste específico
    const updateSetting = async (key: keyof Settings, value: boolean | string) => {
        if (!settings.hasOwnProperty(key)) {
            console.error('Ajuste no encontrado:', key);
            return;
        }
        try {
            const newSettings = { ...settings, [key]: value };
            await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
            setSettings(newSettings);
            console.log('Ajuste actualizado:', key, value);
        } catch (error) {
            console.error('Error al actualizar los ajustes:', error);
        }
    };

    // Función para restablecer los ajustes a los valores predeterminados

    const resetSettings = async () => {
        try {
            await AsyncStorage.removeItem('settings');
            setSettings(defaultSettings);
            console.log('Ajustes restablecidos a los valores predeterminados');
        } catch (error) {
            console.error('Error al restablecer los ajustes:', error);
        }
    };

    // Función para obtener un ajuste específico
    const getSetting = (key: keyof Settings) => settings[key];

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, getSetting, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

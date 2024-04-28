import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Creamos el contexto
const LocalDraftsContext = createContext<any>(null);

// Creamos el proveedor
export const LocalDraftsProvider = ({ children }: any) => {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loadDraftsComplete, setLoadDraftsComplete] = useState<boolean>(false);

    useEffect(() => {
        const loadDrafts = async () => {
            try {
                const storedDrafts = await AsyncStorage.getItem('drafts');
                if (storedDrafts) {
                    setDrafts(JSON.parse(storedDrafts));
                }
                setLoadDraftsComplete(true); // Marcar la carga de borradores como completa
            } catch (error) {
                console.error('Error al cargar los borradores locales:', error);
            }
        };

        loadDrafts();

        return () => { };
    }, []); // El efecto se ejecuta solo una vez al montar el componente

    const saveDraft = async (formId: string, draft: any) => {
        console.log(`Saving draft for form ${formId}`);
        try {
            let newDrafts = [];
            const storedDrafts = await AsyncStorage.getItem('drafts');
            if (storedDrafts) {
                newDrafts = JSON.parse(storedDrafts);
                const index = newDrafts.findIndex((item: any) => item.formId === formId);
                if (index !== -1) {
                    newDrafts[index].draft = draft;
                } else {
                    newDrafts.push({ formId, draft });
                }
            } else {
                newDrafts.push({ formId, draft });
            }
            await AsyncStorage.setItem('drafts', JSON.stringify(newDrafts));
            setDrafts(newDrafts); // Actualizar drafts después de guardar en AsyncStorage
        } catch (error) {
            console.error('Error al guardar el borrador:', error);
        }
    };

    const getDraft = (formId: string) => {
        console.log(`Getting draft for form ${formId}`);
        console.log(drafts);
        const draft = drafts.find((item: any) => item.formId === formId);
        draft ? console.log(`Draft found for form ${formId}`) : console.log(`Draft not found for form ${formId}`);
        return draft ? draft.draft : null;
    };

    const getDrafts = () => {
        console.log('Getting drafts');
        return drafts;
    };

    const clearDrafts = async () => {
        console.log('Clearing drafts');
        try {
            await AsyncStorage.removeItem('drafts');
            setDrafts([]);
            console.log('Drafts cleared');
        } catch (error) {
            console.error('Error al borrar los borradores locales:', error);
        }
    }

    return (
        <LocalDraftsContext.Provider value={{ saveDraft, getDraft, getDrafts, clearDrafts }}>
            {children}
        </LocalDraftsContext.Provider>
    );
};

export const useLocalDrafts = () => useContext(LocalDraftsContext);

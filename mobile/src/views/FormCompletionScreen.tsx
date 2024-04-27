import { JSONText } from "@/components/JSONText";
import SectionHeader from "@/components/SectionHeader";
import { Theme } from "@/theme";
import { StyleSheet } from "react-native";
import { formServices } from "@/services/forms";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react"
import { Button, Div, ScrollDiv, Text } from "react-native-magnus";
import { FormWithoutSteps } from "@/components/home/forms/FormWithoutSteps";
import { FormLocked } from "@/components/home/forms/FormLocked";
import { FormStep } from "@/components/home/forms/FormStep";

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.BACKGROUND_COLOR,
        flex: 1,
    },
});

export const FormCompletionScreen = () => {
    const [form, setForm] = useState<any>(null);
    /*
        Form draft is the form that the user is filling out. 
        It is a draft because it is not yet submitted.

        Should save the progress of the form in the backend and local storage.

        The object should be like this:
        {
            field_id: value,
            field_id: value
        }

        On load, the form should be loaded from the backend and the local storage
        and populate the fields with the values.

        If the form has changed on the backend (For example, field deleted), ignore the uneeded fields on iteration.

    */
    const [formDraft, setFormDraft] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isFormLocked, setIsFormLocked] = useState<boolean>(false);
    const route = useRoute();
    const { formId } = route.params as any;
    const { getForm } = formServices();

    const updateFieldValue = (fieldId: string, value: any) => {
        console.log(`Updating field ${fieldId} with value ${value}`);
        setFormDraft((prev: any) => {
            return {
                ...prev,
                [fieldId]: value,
            }
        });
    }


    useEffect(() => {
        const pollForm = async () => {
            try {
                const serverForm = await getForm(formId);
                if (JSON.stringify(serverForm) !== JSON.stringify(form)) {
                    setIsFormLocked(true);
                }
            } catch (error) {
                console.error("Error al obtener el formulario:", error);
            }
        };

        // const interval = setInterval(pollForm, 20000);


        console.log(formId);
        getForm(formId).then((form) => {
            setForm(form);
            console.log(JSON.stringify(form, null, 2));
        });

        return () => {
            // clearInterval(interval);
        }

    }, []);

    if (!form) {
        return <Div><Text>Cargando...</Text></Div>;
    }

    return (
        <Div style={styles.container}>
            <SectionHeader>
                <Text fontSize="2xl" fontWeight="bold" ellipsizeMode="tail" numberOfLines={1}>
                    {form.title}
                </Text>
            </SectionHeader>

            <ScrollDiv style={{ paddingHorizontal: 16 }} py={8}>
                {
                    isFormLocked && (
                        <FormLocked />
                    )
                }

                {
                    form.steps.length === 0 ? (
                        <FormWithoutSteps />
                    ) : (
                        <>
                            <Text> Paso {currentStep + 1} de {form.steps.length}</Text>
                            {
                                form.steps.map((step: any, index: number) => (
                                    index === currentStep ? (
                                        <FormStep key={index} step={step} updateFieldValue={updateFieldValue} isFormLocked={isFormLocked} formDraft={formDraft} />
                                    ) : null
                                ))
                            }

                            {
                                currentStep < form.steps.length - 1 ? (
                                    <Div>
                                        <Button onPress={() => setCurrentStep(currentStep + 1)}>Siguiente</Button>
                                    </Div>
                                ) : (
                                    <Div>
                                        <Button onPress={() => console.log("Submit")}>Enviar</Button>
                                    </Div>
                                )
                            }
                        </>
                    )
                }

                <Text fontSize="xl" fontWeight="bold" mt={16}>
                    Current Data (Draft)
                </Text>

                <JSONText text={formDraft} />

                <Text fontSize="xl" fontWeight="bold" mt={16}>
                    Form Data
                </Text>

                <JSONText text={form} />


            </ScrollDiv>
        </Div>
    )
}
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
import { FormStepper } from "@/components/home/forms/FormStepper";
import { useLocalDrafts } from "@/providers/LocalDraftsProvider";
import { useDebounce } from "@uidotdev/usehooks";
import { SavingLocally } from "@/components/home/forms/SavingLocally";


const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.BACKGROUND_COLOR,
        flex: 1,
    },
});

const DEBOUNCE_TIME = 1000;

export const FormCompletionScreen = () => {
    const [form, setForm] = useState<any>(null);
    /*
        Form draft is the form that the user is filling out. 
        The object should be like this:
        {
            field_id: value,
            field_id: value
        }

        On load, the form should be loaded from the backend and the local storage
        and populate the fields with the values.

    */
    const [formDraft, setFormDraft] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isFormLocked, setIsFormLocked] = useState<boolean>(false);
    const [isSavingLocalDraft, setIsSavingLocalDraft] = useState<boolean>(false);
    const route = useRoute();
    const { formId } = route.params as any;
    const { getForm } = formServices();
    const { getDraft, saveDraft } = useLocalDrafts();

    const debouncedDraft = useDebounce(formDraft, 5000);


    const updateFieldValue = (fieldId: string, value: any) => {
        console.log(`Updating field ${fieldId} with value ${value}`);
        setIsSavingLocalDraft(true);
        setFormDraft((prev: any) => {
            const updatedDraft = {
                ...prev,
                [fieldId]: value,
            };
            return updatedDraft;
        });
    };

    useEffect(() => {
        if (formDraft) {
            saveDraft(formId, formDraft);
            setIsSavingLocalDraft(false);
        }
    }, [debouncedDraft]);


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
            const draft = getDraft(formId);
            if (draft) {
                setFormDraft(draft);
            } else {
                setFormDraft({});
            }
        });

        return () => {
            // clearInterval(interval);
        }

    }, []);

    if (!form || !formDraft) {
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
                    Current Step (JSON)
                </Text>

                <JSONText text={form.steps[currentStep]} />

                <Text fontSize="xl" fontWeight="bold" mt={16}>
                    Form Data
                </Text>

                <JSONText text={form} />


            </ScrollDiv>
            {
                isSavingLocalDraft && (
                    <SavingLocally />
                )
            }
            <FormStepper steps={form.steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </Div>
    )
}
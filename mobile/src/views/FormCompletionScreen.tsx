import { JSONText } from "@/components/JSONText";
import SectionHeader from "@/components/SectionHeader";
import { Theme } from "@/theme";
import { StyleSheet } from "react-native";
import { formServices } from "@/services/forms";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react"
import { Button, Div, Icon, ScrollDiv, Text } from "react-native-magnus";
import { FormWithoutSteps } from "@/components/home/forms/FormWithoutSteps";
import { FormLocked } from "@/components/home/forms/FormLocked";
import { FormStep } from "@/components/home/forms/FormStep";
import { FormStepper } from "@/components/home/forms/FormStepper";
import { useLocalDrafts } from "@/providers/LocalDraftsProvider";
import { useDebounce } from "@uidotdev/usehooks";
import { SavingLocally } from "@/components/home/forms/SavingLocally";
import { showMessage, hideMessage } from "react-native-flash-message";
import { useSocket } from "@/providers/SocketIOProvider";
import FormNavigation from "@/components/home/forms/FormNavigation";
import { Socket } from "socket.io-client";


const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.BACKGROUND_COLOR,
        flex: 1,
    },
});

const DEBOUNCE_TIME = 5000;

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
    const navigation = useNavigation();
    const { formId } = route.params as any;
    const { getForm } = formServices();
    const { getDraft, saveDraft } = useLocalDrafts();
    const socket = useSocket() as Socket

    socket.emit('/subscribe', `/forms/${formId}`)

    socket.on("form_updated", (data: any) => {
        setIsFormLocked(true);
        setIsSavingLocalDraft(true);
        setFormDraft((prev: any) => {
            return {
                ...prev,
                ...data,
            };
        });
    });

    const debouncedDraft = useDebounce(formDraft, DEBOUNCE_TIME);

    const isFormRequiredFieldsFilled = () => {
        if (!formDraft || !form.steps) {
            return false;
        }

        for (const step of form.steps) {
            if (!step.fields) {
                continue;
            }

            for (const field of step.fields) {
                if (field.required && (!formDraft[field.id] || formDraft[field.id] === "")) {
                    return false;
                }
            }
        }

        return true;
    };



    const onFormSubmit = () => {
        if (!isFormRequiredFieldsFilled()) {
            showMessage({
                message: "Faltan campos por completar",
                description: "Por favor, complete los campos obligatorios antes de enviar el formulario.",
                type: "warning",
                icon: (props: any) => <Icon name="alert-triangle" fontFamily="Feather" color="white" {...props} />,
            });
            return;
        }


        console.log("Form submitted");
    }


    const updateFieldValue = (fieldId: string, value: any) => {
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
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (isSavingLocalDraft) {
                e.preventDefault();
                showMessage({
                    message: "Guardando cambios",
                    description: "Un momento por favor, estamos guardando los cambios en el borrador local.",
                    type: "info",
                    icon: (props: any) => <Icon name="edit" fontFamily="Feather" color="white" {...props} />,
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, [isSavingLocalDraft]);



    useEffect(() => {
        getForm(formId).then((form) => {
            setForm(form);
            const draft = getDraft(formId);
            if (draft) {
                setFormDraft(draft);
            } else {
                setFormDraft({});
            }
        });

        return () => {
            socket?.removeListener(`/forms/${formId}`);
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


            <ScrollDiv style={{ paddingHorizontal: 16 }}>
                <Div my={4}>
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

                            </>
                        )
                    }


                    {/* 
                    <Text fontSize="xl" fontWeight="bold" mt={16}>
                        Current Step (JSON)
                    </Text>

                    <JSONText text={form.steps[currentStep]} />

                    <Text fontSize="xl" fontWeight="bold" mt={16}>
                        Form Data
                    </Text>

                    <JSONText text={form} /> */}

                </Div>
            </ScrollDiv>
            {
                isSavingLocalDraft && (
                    <SavingLocally />
                )
            }
            {
                form.steps.length > 0 && (
                    <Div p={4} bg="white" shadow="md" row justifyContent="space-between">
                        <FormNavigation
                            currentStep={currentStep}
                            totalSteps={form.steps.length}
                            onNextStep={() => setCurrentStep(currentStep + 1)}
                            onPreviousStep={() => setCurrentStep(currentStep - 1)}
                            onSubmit={onFormSubmit}
                            isFormLocked={isFormLocked}
                        />
                    </Div>
                )
            }
            <FormStepper steps={form.steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </Div>
    )
}
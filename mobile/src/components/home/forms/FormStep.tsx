import { Div, Text } from "react-native-magnus";
import { FormField } from "./FormField";


export const FormStep = ({ step, updateFieldValue, isFormLocked, formDraft }: { step: any, updateFieldValue: Function, isFormLocked: boolean, formDraft: any }) => {
    return (
        <Div bg="white" p={8} rounded="md" my={4}>
            <Text color="gray600" fontSize="xl" fontWeight="bold">
                {step.title}
            </Text>
            {
                step.description &&
                <Text color="gray600">
                    {step.description}
                </Text>
            }

            <Div>
                {
                    step.fields.map((field: any, index: number) => (
                        <FormField key={index} field={field} updateFieldValue={updateFieldValue} isFormLocked={isFormLocked} formDraft={formDraft} />
                    ))
                }
            </Div>
        </Div>
    );
}
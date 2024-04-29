import React from 'react';
import { Button, Div, Icon } from 'react-native-magnus';

interface FormNavigationProps {
    currentStep: number;
    totalSteps: number;
    onNextStep: () => void;
    onPreviousStep: () => void;
    onSubmit: () => void;
}

const FormNavigation = ({ currentStep, totalSteps, onNextStep, onPreviousStep, onSubmit }: FormNavigationProps) => {
    return (
        <Div flex={1} p={4} alignItems="flex-end" justifyContent="space-between" row>
            <Div mr={4}>
                {currentStep > 0 && (
                    <Button
                        rounded="circle"
                        bg="gray300"
                        prefix={
                            <Icon
                                name="chevron-left"
                                color="gray600"
                                fontFamily="Feather"
                                fontSize="lg"
                                mr={8}
                            />
                        }
                        color="gray700"
                        onPress={onPreviousStep}>Anterior</Button>
                )}
            </Div>
            <Div>
                {currentStep < totalSteps - 1 ? (
                    <Button
                        bg="gray300"
                        rounded="circle"
                        px={16}
                        onPress={onNextStep}
                        color="gray700"
                        suffix={
                            <Icon
                                name="chevron-right"
                                color="gray600"
                                fontFamily="Feather"
                                fontSize="lg"
                                ml={8}
                            />
                        }>
                        Siguiente
                    </Button>
                ) : (
                    <Button
                        bg="blue500"
                        rounded="circle"
                        px={16}
                        onPress={onSubmit}
                        prefix={
                            <Icon
                                name="send"
                                color="white"
                                fontFamily="Feather"
                                fontSize="lg"
                                mr={8}
                            />
                        }>
                        Enviar
                    </Button>
                )}
            </Div>
        </Div>
    );
};

export default FormNavigation;

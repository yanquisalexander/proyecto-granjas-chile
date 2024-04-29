import React, { useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import { Button, Div, Text } from "react-native-magnus";

export const FormStepper = ({ steps, currentStep, setCurrentStep }: { steps: any, currentStep: number, setCurrentStep: Function }) => {
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        // Hace scroll hasta el botón seleccionado cuando cambia el currentStep
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: (currentStep * 120), animated: true });
        }
    }, [currentStep]);

    return (
        <Div>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled
                ref={scrollViewRef}>
                <Div row shadow="md" p={6} bg="white" flex={1} alignItems="center">
                    {
                        steps.map((step: any, index: number) => (
                            <Button
                                key={index}
                                p={12}
                                mx={4}
                                bg={currentStep === index ? "blue500" : "blue100"}
                                rounded="circle"
                                onPress={() => setCurrentStep(index)}>
                                <Text
                                    fontSize="md"
                                    color={currentStep === index ? "white" : "blue600"}>
                                    {index + 1}. {step.title}
                                </Text>
                            </Button>
                        ))
                    }
                </Div>
            </ScrollView>
        </Div>
    )
}

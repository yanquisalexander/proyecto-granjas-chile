import { ScrollView } from "react-native"
import { Button, Div, Text } from "react-native-magnus"

export const FormStepper = ({ steps, currentStep, setCurrentStep }: { steps: any, currentStep: number, setCurrentStep: Function }) => {
    return (
        <ScrollView
            horizontal
            fadingEdgeLength={100}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                flexGrow: 1,
                width: '100%',
                justifyContent: 'center',
            }}>
            <Div row shadow="md" p={6} bg="white" flex={1} h={64} alignItems="center">
                {
                    steps.map((step: any, index: number) => (
                        <Button
                            key={index}
                            p={12}
                            mx={4}
                            bg={currentStep === index ? "blue500" : "blue200"}
                            rounded="md"
                            onPress={() => setCurrentStep(index)}
                        >
                            <Text
                                fontSize="md"
                                color={currentStep === index ? "white" : "blue700"}>
                                {index + 1}. {step.title}
                            </Text>
                        </Button>
                    ))
                }
            </Div>
        </ScrollView>
    )
}
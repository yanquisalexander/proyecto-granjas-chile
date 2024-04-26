import { Div, Text } from "react-native-magnus"

// Solo debe recibir un componente Text como children
const SectionHeader = ({ children }: any) => {
    if (children.type !== Text) {
        console.warn('SectionHeader children must be a Text component (From react-native-magnus)')
        return null
    }
    return (
        <Div py={16} px={16} bg="white" borderBottomWidth={1} borderBottomColor="#ddd">
            {children}
        </Div>
    )
}

export default SectionHeader
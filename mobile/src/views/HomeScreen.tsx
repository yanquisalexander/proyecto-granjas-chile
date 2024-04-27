import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from "@/providers/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, Image, ScrollDiv, Div, Icon, Tag } from "react-native-magnus";
import { Emotes } from "@/emotes";
import { JSONText } from "@/components/JSONText";
import { Emote } from "@/components/Emote";
import { NoEnterpriseAsigned } from "@/components/home/NoEnterpriseAsigned";
import { MyEnterprise } from "@/components/home/MyEnterprise";
import LoggedAsAdmin from "@/components/home/LoggedAsAdmin";
import { Theme } from "@/theme";
import FormList from "@/components/home/forms/FormList";
import SectionHeader from "@/components/SectionHeader";

enum FormStatus {
    DRAFT = 'draft',
    COMPLETION_PENDING = 'COMPLETION_PENDING',
    SUBMITTED = 'submitted',
    REJECTED = 'rejected',
}

interface Form {
    title: string;
    description: string;
    state: FormStatus;
}

const forms: Form[] = [
    {
        title: 'Formulario de inspección de tractores',
        description: 'Formulario para inspeccionar los tractores antes de salir a trabajar',
        state: FormStatus.COMPLETION_PENDING,
    },
    {
        title: 'Formulario de inspección de cosechadoras',
        description: 'Formulario para inspeccionar las cosechadoras antes de salir a trabajar',
        state: FormStatus.DRAFT,
    },
    {
        title: 'Formulario de inspección de sembradoras',
        description: 'Formulario para inspeccionar las sembradoras antes de salir a trabajar',
        state: FormStatus.SUBMITTED,
    },
    {
        title: 'Formulario de inspección de pulverizadoras',
        description: 'Formulario para inspeccionar las pulverizadoras antes de salir a trabajar',
        state: FormStatus.COMPLETION_PENDING,
    },
    {
        title: 'Formulario de inspección de tolvas',
        description: 'Formulario para inspeccionar las tolvas antes de salir a trabajar',
        state: FormStatus.COMPLETION_PENDING,
    },
    {
        title: 'Formulario de inspección de camiones',
        description: 'Formulario para inspeccionar los camiones antes de salir a trabajar',
        state: FormStatus.COMPLETION_PENDING,
    },
    {
        title: 'Formulario de inspección de acoplados',
        description: 'Formulario para inspeccionar los acoplados antes de salir a trabajar',
        state: FormStatus.COMPLETION_PENDING,
    },
    {
        title: 'Formulario de inspección de tractores',
        description: 'Formulario para inspeccionar los tractores antes de salir a trabajar',
        state: FormStatus.COMPLETION_PENDING,
    },
    {
        title: 'Formulario de inspección de cosechadoras',
        description: 'Formulario para inspeccionar las cosechadoras antes de salir a trabajar',
        state: FormStatus.COMPLETION_PENDING,
    },
    {
        title: 'Formulario de inspección de sembradoras',
        description: 'Formulario para inspeccionar las sembradoras antes de salir a trabajar',
        state: FormStatus.COMPLETION_PENDING,
    }
]

const RenderTag = ({ status }: { status: FormStatus }) => {
    switch (status) {
        case FormStatus.DRAFT:
            return <Tag bg="gray200" color="gray700">Borrador</Tag>
        case FormStatus.COMPLETION_PENDING:
            return <Tag bg="yellow200" color="yellow700">Pendiente de completar</Tag>
        case FormStatus.SUBMITTED:
            return <Tag bg="green200" color="green700">Enviado</Tag>
        case FormStatus.REJECTED:
            return <Tag bg="red200" color="red700">Rechazado</Tag>
        default:
            return <Tag bg="gray200" color="gray700">Borrador</Tag>
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.BACKGROUND_COLOR,
        flex: 1,
    },
});

const HomeScreen = () => {
    const { authState } = useAuth();
    const navigation = useNavigation();
    return (
        <Div style={styles.container}>
            <SectionHeader>
                <Text fontSize="2xl" fontWeight="bold">
                    Formularios a completar <Emote value={Emotes.TRACTOR} />
                </Text>
            </SectionHeader>
            <ScrollDiv style={{ paddingHorizontal: 16 }} py={8}>
                <Div>
                    {
                        !authState || !authState.user || !authState.user.enterprise ? (
                            <NoEnterpriseAsigned />
                        ) : (
                            <>
                                <MyEnterprise />
                                <JSONText text={authState.user} />
                            </>
                        )
                    }
                </Div>

                <FormList />

                {/* Fake FormList */}

                <Div py={16} rounded="md" my={4}>


                    {
                        forms.map((form, index) => (
                            <Div key={index} bg="white" p={8} rounded="md" my={4} borderWidth={1} borderColor="#ddd" row
                                alignItems="flex-start">

                                <Div mr={12}>
                                    <Icon name="puzzle-edit-outline" fontSize="4xl" color="green500" fontFamily="MaterialCommunityIcons" bg="green100" p={8} rounded="md" />
                                </Div>
                                <Div flex={1}>

                                    <Text fontSize="xl" fontWeight="500" fontFamily="Inter_500Medium" ellipsizeMode="tail" numberOfLines={2} >
                                        {form.title}
                                    </Text>
                                    <RenderTag status={form.state} />

                                    {
                                        form.state !== FormStatus.COMPLETION_PENDING ? (


                                            <Div mt={16} justifyContent="flex-end" row>
                                                <Button
                                                    bg="blue100"
                                                    color="blue700"
                                                    onPress={() => {
                                                        navigation.navigate('FormCompletion', { formId: '60031390-a2a7-40ab-b02a-26a02a4b5823' })
                                                    }}
                                                    prefix={
                                                        <Icon name="pencil" fontSize="lg" color="blue700" fontFamily="MaterialCommunityIcons" mr={8} />
                                                    }
                                                >
                                                    Completar
                                                </Button>

                                            </Div>
                                        ) : (
                                            <Div mt={16} justifyContent="space-between" row>
                                                <Button
                                                    bg="green100"
                                                    color="green700"
                                                    onPress={() => {
                                                        console.log('Ver')
                                                    }}
                                                    prefix={
                                                        <Icon name="eye" fontSize="lg" color="green700" fontFamily="MaterialCommunityIcons" mr={8} />
                                                    }
                                                >
                                                    Ver
                                                </Button>
                                                <Button
                                                    bg="blue100"
                                                    color="blue700"
                                                    onPress={() => {
                                                        console.log('Completar')
                                                    }}
                                                    prefix={
                                                        <Icon name="pencil" fontSize="lg" color="blue700" fontFamily="MaterialCommunityIcons" mr={8} />
                                                    }
                                                >
                                                    Completar
                                                </Button>

                                            </Div>
                                        )
                                    }

                                </Div>

                            </Div>
                        ))
                    }

                </Div>


            </ScrollDiv>
        </Div>
    );
}

export default HomeScreen;

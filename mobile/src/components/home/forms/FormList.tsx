import { JSONText } from "@/components/JSONText";
import { Constants } from "@/constants";
import { useAuth } from "@/providers/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, FlatList } from "react-native";
import { Div, Text } from "react-native-magnus";

const FormList = () => {
    const { authState } = useAuth()
    const [forms, setForms] = useState([]);

    if (!forms) {
        return <Text>Loading...</Text>;
    }

    useEffect(() => {
        axios.get(`${Constants.BACKEND_URL}/forms/to-fill`, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
            },
        }).then((response) => {
            setForms(response.data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);


    return (
        forms && forms.length === 0 ? (
            <Div bg="white" p={16} rounded="md">
                <Text>No hay formularios para completar</Text>
            </Div>
        ) : (
            <JSONText text={forms} />
        )
    );

}

export default FormList;
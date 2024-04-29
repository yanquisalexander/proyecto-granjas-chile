import React, { useState } from "react";
import { Text, Button, Div } from "react-native-magnus";

export const JSONText = ({ text }: { text: any }) => {
    const [showJSON, setShowJSON] = useState(false);

    const toggleJSON = () => {
        setShowJSON((prev) => !prev);
    };

    return (
        <Div>
            <Button block onPress={toggleJSON}>
                {showJSON ? "Ocultar JSON" : "Ver JSON"}
            </Button>
            {showJSON && (
                <Text style={{ fontFamily: "Inter_400Regular" }}>
                    {JSON.stringify(text, null, 2)}
                </Text>
            )}
        </Div>
    );
};


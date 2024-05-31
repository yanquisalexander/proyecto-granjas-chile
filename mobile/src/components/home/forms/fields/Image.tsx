import React, { useEffect } from 'react';
import { View, Image as RNImage, Button, TouchableOpacity } from 'react-native';
import { Div, Text, Icon } from 'react-native-magnus';
import * as ImagePicker from 'expo-image-picker';
import { FieldOptions } from "@/types";

export const Image = ({ field, updateFieldValue, isFormLocked, formDraft, options }: { field: any, updateFieldValue: Function, isFormLocked: boolean, formDraft: any, options: FieldOptions }) => {
    const {
        field_name,
        conditions,
        required,
        field_type,
    } = field;

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: options.maxImages === 1,
            quality: 1,
            allowsMultipleSelection: options && options.maxImages && options.maxImages > 1 ? true : undefined,
        });

        if (!result.canceled) {
            if (options && options.maxImages && options.maxImages > 1) {
                // If multiple images allowed, store them in an array
                updateFieldValue(field_name, [...(formDraft[field_name] || []), ...result.assets.map(asset => asset.base64)]);
            } else {
                // If single image allowed, store it directly
                if (result.assets && result.assets.length > 0) updateFieldValue(field_name, [result.assets[0].base64]);
            }
        }
    };

    const handleDeleteImage = (indexToDelete: number) => {
        const updatedImages = formDraft[field_name].filter((image: string, index: number) => index !== indexToDelete);
        updateFieldValue(field_name, updatedImages);
    };

    const previewInLightbox = (index: number) => {
        console.log('Previewing image in lightbox', index);
    }

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    return (
        <View>
            <Button onPress={handleImagePicker} title="Pick an image from camera roll">

            </Button>
            {formDraft[field_name] && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {formDraft[field_name].map((image: string, index: number) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => previewInLightbox(index)} style={{ position: 'relative' }}>
                                <RNImage source={{ uri: `data:image/png;base64,${image}` }} style={{ width: 100, height: 100 }} />
                                <TouchableOpacity onPress={() => handleDeleteImage(index)} style={{ position: 'absolute', top: 0, right: 0, padding: 2, backgroundColor: 'white' }}>
                                    <Icon name="close" color="red500" fontSize={18} />
                                </TouchableOpacity>
                            </TouchableOpacity>

                        </View>


                    ))}
                </View>
            )}
        </View>
    );
};

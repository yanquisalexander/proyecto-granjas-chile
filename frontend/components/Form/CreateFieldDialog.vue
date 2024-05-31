<template>
    <UModal v-bind="$attrs" @close="closeDialog">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

            <template #header>
                <h2 class="text-lg font-semibold">Añadir campo</h2>
            </template>
            <div class="flex flex-col gap-4">
                <UFormGroup label="Nombre del campo" name="field_name">
                    <UInput v-model="newField.field_name" />
                </UFormGroup>
                <UFormGroup label="Descripción" name="description">
                    <UInput v-model="newField.description" />
                </UFormGroup>
                <UFormGroup label="Tipo de campo" name="field_type">
                    <USelect v-model="newField.field_type" :options="fieldTypes" option-attribute="label" />
                </UFormGroup>

                <UFormGroup label="Requerido" name="required" v-if="canHaveRequired">
                    <UToggle v-model="newField.required" />
                </UFormGroup>

                <UFormGroup label="Opciones" name="options" v-if="fieldOptions.length > 0">
                    <div v-if="newField.field_type === 'short_text'">
                        <UFormGroup label="Longitud máxima" name="maxLength" min="0">
                            <UInput v-model="newField.options.maxLength" type="number" />
                        </UFormGroup>
                    </div>
                    <div v-else-if="newField.field_type === 'scale'">
                        <UFormGroup label="Valor mínimo" name="min">
                            <UInput v-model="newField.options.min" type="number" />
                        </UFormGroup>
                        <UFormGroup label="Valor máximo" name="max">
                            <UInput v-model="newField.options.max" type="number" />
                        </UFormGroup>
                    </div>
                </UFormGroup>

            </div>
            <template #footer>
                <div class="flex justify-end space-x-4">
                    <UButton type="button" color="white" @click="closeDialog">
                        Cancelar
                    </UButton>
                    <UButton type="button" color="blue" @click="addField">
                        Añadir campo
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script lang="ts" setup>
import type { Step } from "~/types";
const props = defineProps<{
    step: Step['id'],
    showDialog: boolean,
}>();

const attrs = useAttrs() as { 'onUpdate:modelValue': (value: boolean) => void };
const emit = defineEmits(['addField']);

const newField = ref({
    field_name: '',
    description: '',
    field_type: '',
    required: false,
    options: {
        maxLength: 0,
        minLength: 0,
        max: 0,
        min: 0,
    },
});

const resetField = () => {
    newField.value = {
        field_name: '',
        description: '',
        field_type: '',
        required: false,
        options: {
            maxLength: 0,
            minLength: 0,
            max: 0,
            min: 0,
        },
    };
}

const closeDialog = () => {
    attrs['onUpdate:modelValue'](false);
    resetField();
}




const fieldTypes = ref([
    { label: 'Texto corto', value: 'short_text' },
    { label: 'Sí/No', value: 'yes_no' },
    { label: 'Escala', value: 'scale' },
]);

const fieldOptions = computed(() => {
    if (newField.value.field_type === 'short_text') {
        return ['maxLength'];
    } else if (newField.value.field_type === 'scale') {
        return ['min', 'max'];
    }
    return [];
});

const addField = () => {
    if (!newField.value.field_name || !newField.value.field_type) {
        return;
    }

    if (newField.value.field_type === 'short_text' && newField.value.options.maxLength === 0) {
        newField.value.options.maxLength = 255;
    }
    if (newField.value.field_type === 'scale' && newField.value.options.min === 0) {
        newField.value.options.min = 0;
    }
    if (newField.value.field_type === 'scale' && newField.value.options.max === 0) {
        newField.value.options.max = 10;
    }


    emit('addField', newField.value);
    closeDialog();
}

const canHaveRequired = computed(() => {
    return ['short_text'].includes(newField.value.field_type);
});
</script>
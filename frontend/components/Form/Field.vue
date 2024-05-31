<template>
    <div class="flex flex-row gap-2 py-4 px-2 relative items-start">
        <UButton icon="i-tabler-arrows-move" color="blue" class="handle-dnd cursor-move" />
        <div class="flex flex-col gap-2">
            <h3 class="truncate">{{ props.fieldData.field_name }}</h3>
            <p class="text-sm text-gray-500 truncate">{{ props.fieldData.description }}</p>


            <template v-if="props.fieldData.field_type === 'yes_no'">
                <LazyUToggle v-model="selfValue" />
            </template>

            <template v-else-if="props.fieldData.field_type === 'short_text'">
                <UInput v-model="selfValue" :maxlength="props.fieldData.options.maxLength" />
            </template>

            <template v-else-if="props.fieldData.field_type === 'scale'">
                <URange v-model="selfValue" :min="props.fieldData.options.min" :max="props.fieldData.options.max" />
            </template>


            <template v-if="props.fieldData.required">
                <span class="text-xs text-red-500">Campo requerido</span>
            </template>

            <template v-if="hasOptions">
                <span class="text-xs text-gray-500">
                    Configuración de longitud: {{ lengthConfiguration }} <br>
                    Configuración de rango: {{ rangeConfiguration }}
                </span>
            </template>


        </div>
        <div class="flex flex-1" />
        <div class="flex gap-2">
            <FormContextualMenu :field="props.fieldData" @move-field="console.log($event)"
                @delete-field="deleteField" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type EditedForm } from "~/types";
const props = defineProps<{
    form: EditedForm
    fieldData: EditedForm["steps"][0]["fields"][0]
}>()

// Used to preview the value of the field
const selfValue = ref<any>(null)

const emits = defineEmits(["deleteField"])

const deleteField = () => {
    emits('deleteField', props.fieldData.id)
}

const hasOptions = computed(() => {
    const { options } = props.fieldData;
    return options.minLength || options.maxLength || options.max || options.min;
});

const lengthConfiguration = computed(() => {
    const { options } = props.fieldData;
    return (options.minLength ? options.minLength + ' - ' : '') + (options.maxLength || '');
});

const rangeConfiguration = computed(() => {
    const { options } = props.fieldData;
    return (options.min ? options.min + ' - ' : '') + (options.max || '');
});
</script>
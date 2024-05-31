<template>
    <div class="flex items-center justify-between mb-6">
        <template v-if="editingTitle">
            <UInput v-model="stepName" @blur="editingTitle = false" />
        </template>
        <template v-else>
            <h3 class="text-lg font-semibold" @click="editingTitle = true">{{ stepName }}</h3>
        </template>
    </div>
    <template v-if="editingDescription">
        <UInput v-model="stepDescription" @blur="editingDescription = false" />
    </template>
    <template v-else-if="stepDescription">
        <p @click="editingDescription = true">{{ stepDescription }}</p>
    </template>
    <template v-else>
        <em @click="editingDescription = true" class="text-gray-500 dark:text-gray-400">
            Haz clic para añadir una descripción descripción
        </em>
    </template>

    <div class="flex items-center justify-end mt-6">
        <UButtonGroup size="md" orientation="horizontal">
            <UButton label="Añadir campo" icon="i-tabler-plus" color="gray" @click="addField" />
            <UButton label="Mover arriba" icon="i-heroicons-chevron-up-20-solid" @click="moveStep('up')" color="gray" />
            <UButton label="Mover abajo" icon="i-heroicons-chevron-down-20-solid" @click="moveStep('down')"
                color="gray" />
            <UButton label="Eliminar paso" icon="i-heroicons-trash-20-solid" color="red" variant="outline"
                @click="emit('deleteStep', props.step.id)" />

        </UButtonGroup>

    </div>
</template>

<script setup lang="ts">
import type { Step } from "~/types";
const props = defineProps<{
    step: Step
}>();

const stepName = ref<string>(props.step.title);
const stepDescription = ref<string | undefined>(props.step.description);

const editingTitle = ref<boolean>(false);
const editingDescription = ref<boolean>(false);

const emit = defineEmits(['editTitle', 'editDescription', 'deleteStep', 'addField', 'moveStep']);

watch(() => stepName.value, (newVal) => {
    emit('editTitle', newVal);
});

watch(() => stepDescription.value, (newVal) => {
    emit('editDescription', newVal);
});

const addField = () => {
    emit('addField', props.step.id);
}

const moveStep = (direction: 'up' | 'down') => {
    emit('moveStep', { stepId: props.step.id, direction });
}
</script>
<template>
    <UPopover :popper="{ placement: 'bottom-start' }">
        <template #default="{ open }">
            <UButton color="gray" variant="ghost" square :class="[open && 'bg-gray-50 dark:bg-gray-800']">
                <UIcon name="i-tabler-dots-vertical" class="w-5 h-5" />
            </UButton>
        </template>
        <template #panel="{ close }">
            <div class="p-2 flex flex-col gap-2">
                <UButton color="white" variant="soft" label="Mover campo a otro paso"
                    @click="close(); emit('moveField', props.field)" icon="i-tabler-arrows-up-down" />
                <UButton color="white" variant="soft" label="Configurar campo"
                    @click="close(); emit('configureField', props.field)" icon="i-tabler-settings" />
                <UButton color="red" variant="soft" label="Eliminar campo" icon="i-tabler-trash"
                    @click="close(); emit('deleteField', props.field)" />

            </div>
        </template>
    </UPopover>
</template>

<script lang="ts" setup>
import type { Field } from "~/types";

const props = defineProps<{
    field: Field;
}>();

const emit = defineEmits(["moveField", "deleteField", "configureField"]);
</script>
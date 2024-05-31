<template>
    <UModal v-bind="$attrs">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

            <template #header>
                <h2 class="text-lg font-semibold">Crear formulario</h2>
            </template>
            <div class="flex flex-col gap-4">
                <UFormGroup label="Nombre del formulario" name="title">
                    <UInput v-model="newForm.title" />
                </UFormGroup>
                <UFormGroup label="Descripción" name="description">
                    <UInput v-model="newForm.description" />
                </UFormGroup>
                <UFormGroup label="Estado" name="form_status">
                    <USelect v-model="newForm.form_status" :options="formStatusOptions" option-attribute="label" />
                </UFormGroup>
            </div>
            <template #footer>
                <div class="flex justify-end space-x-4">
                    <UButton type="button" color="white" @click="closeDialog">
                        Cancelar
                    </UButton>
                    <UButton type="button" color="blue" @click="createForm">
                        Crear formulario
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script lang="ts" setup>
const emit = defineEmits(['createForm', 'closeDialog']);
const newForm = reactive({
    title: '',
    description: '',
    form_status: 'draft',
});
const formStatusOptions = ref<any[]>([
    { label: 'Publicado', value: 'published' },
    { label: 'Borrador', value: 'draft' },
    { label: 'Archivado', value: 'archived' },
]);

const createForm = () => {
    console.log(newForm);
    emit('createForm', newForm);
};
</script>

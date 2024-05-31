<template>
    <PageContainer>
        <SectionHeader title="Editar formulario">
            <template #actions>
                <UButton to="/forms" icon="i-tabler-arrow-left">
                    Volver
                </UButton>
            </template>
        </SectionHeader>

        <template v-if="formToEdit">

            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-6">
                    <template v-if="editingTitle">
                        <UInput v-model="formToEdit.title" @blur="editingTitle = false" />
                    </template>
                    <template v-else>
                        <h2 class="text-xl font-semibold" @click="editingTitle = true">{{ formToEdit.title }}</h2>
                    </template>
                </div>
                <div class="flex items-center justify-between">
                    <template v-if="editingDescription">
                        <UInput v-model="formToEdit.description" @blur="editingDescription = false" />
                    </template>
                    <template v-else-if="formToEdit.description">
                        <p @click="editingDescription = true">{{ formToEdit.description }}</p>
                    </template>
                    <template v-else>
                        <em @click="editingDescription = true" class="text-gray-500 dark:text-gray-400">
                            Haz clic para añadir una descripción
                        </em>
                    </template>
                </div>
            </div>

            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold">Pasos</h3>
                <UButton @click="addStep" icon="i-tabler-plus">
                    Añadir paso
                </UButton>
            </div>
            <template v-for="(step, index) in formToEdit.steps" :key="step.id">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                    <FormStepDetails :step="step" @edit-title="editStepDetails(step.id, $event)"
                        @edit-description="editStepDetails(step.id, undefined, $event)" @move-step="moveStep"
                        @add-field="showAddFieldDialog" @delete-step="deleteStep" />
                    <draggable v-model="formToEdit.steps[index].fields" tag="div" class="mt-6" ghost-class="opacity-50"
                        handle=".handle-dnd" @start="movingField = true" @end="movingField = false">
                        <template #item="{ element }">
                            <FormField :key="element.id" :field-data="element" :form="formToEdit"
                                @delete-field="deleteField" />
                        </template>
                    </draggable>
                </div>
            </template>

            <template v-if="formToEdit.steps.length === 0">
                <div class="flex items-center justify-center h-64">
                    <p class="text-gray-500 dark:text-gray-400">No hay pasos en este formulario</p>
                </div>
            </template>

            <LazyFormCreateFieldDialog @add-field="addField" :step="formToEdit.steps[selectedStep || '']"
                v-model="showCreateFieldDialog" @close="showCreateFieldDialog = false" />

            <div class="flex justify-end mt-6">
                <UButton @click="saveForm">
                    Guardar cambios
                </UButton>
            </div>

        </template>
    </PageContainer>
</template>

<script setup lang="ts">
import { type EditedForm } from "~/types";
import draggable from 'vuedraggable'
const { getForm, updateForm } = useSelfEnterprise();
const route = useRoute();
const toast = useToast();

const formToEdit = ref<EditedForm | null>(null);
const originalForm = ref<EditedForm | null>(null);
const editingTitle = ref<boolean>(false);
const editingDescription = ref<boolean>(false);
const movingField = ref<boolean>(false);
const showCreateFieldDialog = ref<boolean>(false);
const selectedStep = ref<string | null>(null);

const deleteField = (fieldId: string) => {
    if (!formToEdit.value) return;
    formToEdit.value = {
        ...formToEdit.value,
        steps: formToEdit.value.steps.map((step) => ({
            ...step,
            fields: step.fields.filter((field) => field.id !== fieldId),
        })),
    };

    console.log('Field deleted:', fieldId);
};

onBeforeRouteLeave(() => {
    if (!formToEdit.value) return;
    const formHasChanges = JSON.stringify(formToEdit.value) !== JSON.stringify(originalForm.value);
    if (formHasChanges) {
        if (confirm('¿Estás seguro de que quieres salir sin guardar los cambios?')) {
            return true;
        } else {
            return false;
        }
    }
});

const addStep = () => {
    if (!formToEdit.value) return;
    formToEdit.value = {
        ...formToEdit.value,
        steps: [
            ...formToEdit.value.steps,
            {
                id: crypto.randomUUID(),
                title: 'Nuevo paso',
                description: '',
                fields: [],
                step_order: formToEdit.value.steps.length + 1,
            },
        ],
    };
};

// Mueve el paso hacia arriba o hacia abajo, y actualiza el atributo step_order de los pasos
// si no tiene el atributo step_order, deduce el orden de los pasos por el índice en el array
const moveStep = ({ stepId, direction }: { stepId: string; direction: 'up' | 'down' }) => {
    if (!formToEdit.value) return;
    const steps = formToEdit.value.steps;
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    console.log('Moving step:', stepId, direction);
    if (stepIndex === -1) return;

    // Si el paso es el primero y se intenta mover hacia arriba, o si es el último y se intenta mover hacia abajo, no realizar el movimiento
    if ((direction === 'up' && stepIndex === 0) || (direction === 'down' && stepIndex === steps.length - 1)) return;

    const newSteps = [...steps];
    const step = newSteps.splice(stepIndex, 1)[0];
    const newIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    newSteps.splice(newIndex, 0, step);

    // Actualizar el atributo step_order
    const maxStepOrder = newSteps.length; // El máximo valor de step_order será la longitud del array de pasos
    newSteps.forEach((step, index) => {
        // Normalizar el valor de step_order para que esté dentro del rango adecuado
        step.step_order = Math.max(1, Math.min(index + 1, maxStepOrder));
    });

    formToEdit.value = {
        ...formToEdit.value,
        steps: newSteps,
    };
};

const deleteStep = (stepId: string) => {
    if (!formToEdit.value) return;
    if (confirm('¿Estás seguro de que quieres eliminar este paso?')) {
        formToEdit.value = {
            ...formToEdit.value,
            steps: formToEdit.value.steps.filter((step) => step.id !== stepId),
        };
    }
};



const editStepDetails = (stepId: string, title?: string, description?: string) => {
    if (!formToEdit.value) return;
    formToEdit.value = {
        ...formToEdit.value,
        steps: formToEdit.value.steps.map((step) => {
            if (step.id === stepId) {
                return {
                    ...step,
                    title: title || step.title,
                    description: description || step.description,
                };
            }
            return step;
        }),
    };
};

const loadForm = async () => {
    formToEdit.value = null;
    const formId = route.params.formId as string;
    const form = await getForm(formId);
    if (!form) {
        return;
    }
    formToEdit.value = form;
    // Save a copy of the original form to compare changes
    originalForm.value = { ...form };
};

const saveForm = async () => {
    if (!formToEdit.value) return;
    console.log('Saving form:', formToEdit.value);
    try {
        await updateForm(formToEdit.value.id, formToEdit.value);
        toast.add({
            title: 'Formulario actualizado',
            description: 'Los cambios se han guardado correctamente',
            color: 'green',
            icon: 'i-tabler-check',
        });
        await loadForm();

    } catch (error) {
        console.error('Error updating form:', error);
        toast.add({
            title: 'Error al actualizar el formulario',
            description: 'Ha ocurrido un error al guardar los cambios',
            color: 'red',
            icon: 'i-tabler-alert-triangle',
        });
    }
};

const handleFieldsReorder = () => {
    // Reorder fields when a field is moved
    // Cambia su orden en el array de fields
    // y actualiza el atributo field_order de los campos
    if (!formToEdit.value) return;
    formToEdit.value.steps.forEach((step) => {
        step.fields.forEach((field, index) => {
            field.field_order = index + 1;
        });
    });
};

watch(movingField, (newVal) => {
    if (!newVal) {
        handleFieldsReorder();
    }
});

const showAddFieldDialog = (stepId: string) => {
    selectedStep.value = stepId;
    showCreateFieldDialog.value = true;
};

const addField = (fieldData: EditedForm['steps'][0]['fields'][0]) => {
    if (!formToEdit.value || !selectedStep.value) return;
    formToEdit.value = {
        ...formToEdit.value,
        steps: formToEdit.value.steps.map((step) => {
            if (step.id === selectedStep.value) {
                return {
                    ...step,
                    fields: [
                        ...step.fields,
                        {
                            ...fieldData,
                            id: crypto.randomUUID(),
                            field_order: step.fields.length + 1,
                        },
                    ],
                };
            }
            return step;
        }),
    };
    showCreateFieldDialog.value = false;
};

onMounted(async () => {
    await loadForm();
});

</script>
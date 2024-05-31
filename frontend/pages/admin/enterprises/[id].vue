<template>
    <PageContainer>

        <template v-if="enterprise && editedEnterprise">
            <header class="flex my-4">
                <h1 class="text-xl font-medium">
                    Editando <em>{{ enterprise.name }}</em>
                </h1>
                <div class="flex-1"></div>
                <UButton to="/admin/enterprises" color="gray" variant="soft">
                    <UIcon name="i-tabler-arrow-back" />
                    <span>Regresar</span>
                </UButton>
            </header>

            <div class="flex flex-col space-y-6">

                <UAlert v-if="enterprise.admins?.length === 0" color="red" title="Empresa sin administradores"
                    variant="soft" icon="i-tabler-user-x"
                    description="Esta empresa no tiene administradores asignados. Se recomienda asignar al menos un administrador para poder gestionar la empresa." />


                <UFormGroup label="ID de Empresa" name="id">
                    <div class="flex items-center w-full">
                        <UInput v-model="editedEnterprise.id" disabled class="flex-1" />
                        <UButton variant="soft" color="gray" @click="copyEnterpriseIdToClipboard">
                            <UIcon name="i-tabler-copy" />
                        </UButton>
                    </div>
                </UFormGroup>

                <UFormGroup label="Nombre de la empresa" name="name">
                    <UInput v-model="editedEnterprise.name" />
                </UFormGroup>

                <UFormGroup label="Logo" name="logo">
                    <img class="preview h-32"
                        :src="imageToPreview || `${Configuration.BACKEND_URL}${enterprise.company_logo}`"
                        :alt="`Logo de ${enterprise.name}`" />
                    <UInput type="file" accept="image/*" @change="handleImageChange" />
                </UFormGroup>


                <UFormGroup label="Descripción" name="description">
                    <UTextarea v-model="editedEnterprise.description" autoresize />
                </UFormGroup>

                <UFormGroup label="Empresa creada el" name="created_at">
                    <p>{{ new Date(enterprise.created_at).toLocaleDateString() }}</p>
                </UFormGroup>

                <UFormGroup label="Última actualización" name="updated_at">
                    <p>{{ new Date(enterprise.updated_at).toLocaleDateString() }}</p>
                </UFormGroup>

                <UFormGroup label="Administradores" name="admins">
                    <ul class="list-disc list-inside">
                        {{ enterprise.admins }}
                        <li v-for="admin in enterprise.admins" :key="admin.id">
                            <NuxtLink class="text-blue-500" :to="`/users/${admin.id}`">{{ admin.username }}</NuxtLink>
                        </li>
                    </ul>

                    <UButton color="blue" @click="addAdminModal = true">
                        <UIcon name="i-tabler-user-plus" />
                        <span>Agregar administrador</span>
                    </UButton>
                </UFormGroup>
                <footer class="flex justify-end mt-4">
                    <UButton color="blue" @click="editEnterprise">
                        Guardar cambios
                    </UButton>
                </footer>
            </div>
        </template>
        <div v-else>
            <UProgress animation="carousel" color="blue" />
            <p class="text-center mt-4">Cargando...</p>
        </div>

        <UModal v-model="addAdminModal">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h2 class="text-xl font-medium">Agregar administrador</h2>
                </template>
                <p>Selecciona un usuario para añadir como administrador de la empresa</p>
                <USelectMenu searchable v-model="selectedAdminToAdd" :options="users" option-attribute="username"
                    value-attribute="id">
                </USelectMenu>

                <UAlert v-if="enterprise?.admins?.find(admin => admin.id === selectedAdminToAdd)" color="blue"
                    class="mt-2" variant="soft" icon="i-tabler-user-check" title="Usuario ya es administrador"
                    description="El usuario seleccionado ya es administrador de la empresa" />
                <template #footer>
                    <UButton color="blue" @click="addAdminToEnterprise" :disabled="!selectedAdminToAdd">
                        <UIcon name="i-tabler-user-plus" />
                        <span>Agregar administrador</span>
                    </UButton>
                </template>
            </UCard>

        </UModal>
    </PageContainer>
</template>


<script lang="ts" setup>
import { Configuration } from "~/config";
import type { Enterprise } from "~/types";

const { updateEnterprise, getEnterprise } = useEnterprises();
const { token } = useAuth();
const route = useRoute();
const toast = useToast();

const imageToPreview = ref<string | null>(null);
const enterprise = ref<Enterprise | null>(null);
const editedEnterprise = ref<Enterprise | null>(null);
const addAdminModal = ref(false);
const users = ref<User[]>([]);
const selectedAdminToAdd = ref<string | null>(null);
const { id } = route.params;


watch(addAdminModal, async (value) => {
    if (value) await fetchUsers();
});

const fetchUsers = async () => {
    if (!token.value) return;
    const response = await fetch(`${Configuration.BACKEND_URL}/admin/users`, {
        headers: {
            'Authorization': token.value
        }
    });
    users.value = await response.json();
};

const addAdminToEnterprise = async () => {
    if (!selectedAdminToAdd.value || !enterprise.value || !token.value) return;

    const response = await fetch(`${Configuration.BACKEND_URL}/admin/enterprises/${enterprise.value.id}/admins`, {
        method: 'POST',
        headers: {
            'Authorization': token.value,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: selectedAdminToAdd.value
        })
    });

    if (!response.ok) {
        const errorMessage = await response.json();

        toast.add({
            title: 'Error al agregar administrador',
            description: errorMessage.message ?? 'Ocurrió un error al agregar el administrador a la empresa. Por favor, intenta de nuevo.',
            color: "red",
            icon: "i-tabler-alert-triangle"
        });
        return;
    }

    toast.add({
        title: 'Administrador agregado',
        description: 'El usuario ha sido añadido como administrador de la empresa',
        color: "green",
        icon: "i-tabler-check"
    });
    await fetchEnterprise();
};

const copyEnterpriseIdToClipboard = () => {
    if (!enterprise.value) return;
    navigator.clipboard.writeText(enterprise.value.id);
    toast.add({
        title: 'ID de empresa copiado',
        description: 'El ID de la empresa ha sido copiado al portapapeles',
        color: "green",
        icon: "i-tabler-check"
    });
};

const handleImageChange = (files: FileList | null) => {
    if (!files || !files.length) return;
    const file = files[0];

    editedEnterprise.value.company_logo = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imageToPreview.value = e.target?.result as string;
    };

    reader.readAsDataURL(file);

};



enterprise.value = await getEnterprise(id.toString());
editedEnterprise.value = { ...enterprise.value };


const editEnterprise = async () => {
    const { id } = route.params;
    if (!editedEnterprise.value || !token.value) return;

    const formData = new FormData();
    for (const key in editedEnterprise.value) {
        if (editedEnterprise.value[key] !== enterprise.value[key]) {
            formData.append(key, editedEnterprise.value[key]);
        }
    }

    const response = await fetch(`${Configuration.BACKEND_URL}/admin/enterprises/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': token.value
        },
        body: formData
    });

    const responseJson = await response.json();

    if (!response.ok) {
        toast.add({
            title: 'Error al actualizar la empresa',

            description: responseJson.message || 'Ocurrió un error al actualizar la empresa. Por favor, intenta de nuevo.',
            color: "red",
            icon: "i-tabler-alert-triangle"
        });
        return;
    }

    toast.add({
        title: 'Empresa actualizada',
        description: 'Los cambios han sido guardados',
        color: "green",
        icon: "i-tabler-check"
    });
    await fetchEnterprise();
};

</script>

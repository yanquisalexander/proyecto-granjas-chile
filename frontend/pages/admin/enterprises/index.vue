<template>
    <PageContainer>
        <SectionHeader title="Empresas / PyMES">
            <template #actions>
                <UButton @click="showCreateEnterpriseDialog">Crear Empresa</UButton>
            </template>
        </SectionHeader>

        <template v-if="enterprises">

            <UTable v-if="enterprises.length > 0" :rows="enterprises" :columns="columns">
                <template #company_logo-data="{ row }">
                    <div class="flex items-center space-x-2">
                        <UTooltip v-if="row.admins.length === 0" text="No hay administradores asignados">
                            <UButton color="orange" disabled>
                                <UIcon name="i-tabler-alert-triangle" />
                            </UButton>
                        </UTooltip>
                        <img :src="`${Configuration.BACKEND_URL}${row.company_logo}`" :alt="`Logo de ${row.name}`"
                            class="h-8 w-8 object-cover">
                    </div>
                </template>

                <template #name-data="{ row }">
                    <NuxtLink :to="`/admin/enterprises/${row.id}`">
                        {{ row.name }}
                    </NuxtLink>
                </template>

                <template #description-data="{ row }">
                    <p class="max-w-xs truncate" :title="row.description">
                        {{ row.description ?? '-' }}
                    </p>
                </template>

                <template #created_at-data="{ row }">
                    {{ new Date(row.created_at).toLocaleDateString() }}
                </template>

                <template #updated_at-data="{ row }">
                    {{ new Date(row.updated_at).toLocaleDateString() }}
                </template>

                <template #actions-data="{ row }">
                    <div class="flex space-x-2">
                        <UButton color="blue" variant="soft" :to="`/admin/enterprises/${row.id}`">
                            <UIcon name="i-tabler-edit" />
                        </UButton>
                        <UButton color="red" variant="soft" :disabled="row.deleted_at"
                            :title="row.deleted_at ? 'La empresa ya ha sido eliminada' : ''"
                            @click="showDeleteEnterpriseDialog(row.id)">
                            <UIcon name="i-tabler-trash" />
                        </UButton>
                    </div>
                </template>
            </UTable>
            <div v-else>
                <p>No hay empresas registradas</p>
            </div>

            <UModal v-model="showCreateEnterprise" :ui="{ wrapper: 'z-[9999]' }">
                <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

                    <template #header>
                        <h2 class="text-xl font-bold">
                            Registrar una nueva empresa
                        </h2>
                    </template>

                    <p class="p-4">
                        Ingresa el nombre de la empresa que deseas registrar.
                    </p>

                    <UInput v-model="newEnterprise.name" label="Nombre de la empresa" class="p-4" />


                    <template #footer>
                        <div class="flex justify-end space-x-4">
                            <UButton type="button" color="blue" variant="ghost" @click="showCreateEnterprise = false">
                                Cancel
                            </UButton>
                            <UButton type="button" color="blue" :loading="creatingEnterprise" @click="createEnterprise">
                                <UIcon name="i-tabler-building" />
                                Crear
                            </UButton>
                        </div>
                    </template>
                </UCard>
            </UModal>

            <UModal v-model="showDeleteEnterprise" :ui="{ wrapper: 'z-[9999]' }">
                <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

                    <template #header>
                        <h2 class="text-xl font-bold">
                            ¿Eliminar empresa?
                        </h2>
                    </template>

                    <p class="p-4">
                        ¿Estás seguro que deseas eliminar la empresa <strong>{{ enterprises.find((enterprise) =>
                            enterprise.id ===
                            selectedEnterprise?.id)?.name }}</strong>?
                        Introduce el nombre de la empresa para confirmar la eliminación.
                    </p>

                    <UInput v-model="selectedEnterprise.name" label="Nombre de la empresa" class="p-4" />


                    <template #footer>
                        <div class="flex justify-end space-x-4">
                            <UButton type="button" color="blue" variant="ghost" @click="showDeleteEnterprise = false">
                                Cancel
                            </UButton>
                            <UButton type="button" color="blue" :loading="deletingEnterprise"
                                :disabled="selectedEnterprise?.name !== enterprises.find((enterprise) => enterprise.id === selectedEnterprise?.id)?.name"
                                @click="removeEnterprise">
                                <UIcon name="i-tabler-trash" />
                                Eliminar
                            </UButton>
                        </div>
                    </template>
                </UCard>
            </UModal>
        </template>
    </PageContainer>
</template>

<script setup lang="ts">
import { Configuration } from "~/config";
import { type Enterprise } from "~/types";

const { getEnterprises, deleteEnterprise } = useEnterprises()

const { token } = useAuth()
const toast = useToast()

const enterprises = ref<Enterprise[]>([])

const creatingEnterprise = ref(false)
const deletingEnterprise = ref(false)

const newEnterprise = ref({
    name: ''
})

const columns = ref([
    {
        key: "company_logo",
        label: "Logo"
    },
    {
        key: "name",
        label: "Nombre"
    },
    {
        key: "description",
        label: "Descripción"
    },
    {
        key: "created_at",
        label: "Creada"
    },
    {
        key: "updated_at",
        label: "Actualizada"
    },
    {
        key: "actions",
        label: "Acciones"
    }
])

const showCreateEnterprise = ref(false)
const showDeleteEnterprise = ref(false)

const showCreateEnterpriseDialog = () => {
    showCreateEnterprise.value = true
    newEnterprise.value.name = ''
}

const selectedEnterprise = ref<Enterprise | null>(null)

const showDeleteEnterpriseDialog = (id: string) => {
    // Clonamos el objeto con Object.assign para evitar mutar el objeto original, y eliminamos el nombre para confirmar la eliminación
    selectedEnterprise.value = Object.assign({}, enterprises.value.find((enterprise) => enterprise.id === id))
    selectedEnterprise.value.name = ''
    showDeleteEnterprise.value = true
}

const removeEnterprise = async () => {
    deletingEnterprise.value = true
    try {
        await deleteEnterprise(selectedEnterprise.value?.id)
        toast.add({
            title: 'Empresa eliminada',
            description: 'La empresa ha sido eliminada exitosamente',
            color: "green",
            icon: "i-tabler-building"
        })

        showDeleteEnterprise.value = false
        enterprises.value = await getEnterprises()
    } catch (error) {
        console.error(error)
        toast.add({
            title: 'Error al eliminar empresa',
            description: 'Ocurrió un error al eliminar la empresa',
            color: "red",
            icon: "i-tabler-building"
        })
    } finally {
        deletingEnterprise.value = false
    }
}

const createEnterprise = async () => {
    creatingEnterprise.value = true
    if (!token.value) return
    try {
        const response = await fetch(`${Configuration.BACKEND_URL}/admin/enterprises`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.value
            },
            body: JSON.stringify({
                name: newEnterprise.value.name
            })
        })

        if (response.ok) {
            toast.add({
                title: 'Empresa creada',
                description: 'La empresa ha sido creada exitosamente',
                color: "green",
                icon: "i-tabler-building"
            })
        } else {
            const res = await response.json()
            toast.add({
                title: 'Error al crear empresa',
                description: res.message,
                color: "red",
                icon: "i-tabler-building"
            })
        }



        showCreateEnterprise.value = false


        enterprises.value = await getEnterprises()
    } catch (error) {
        console.error(error)
        toast.add({
            title: 'Error al crear empresa',
            description: 'Ocurrió un error al crear la empresa',
            color: "red",
            icon: "i-tabler-building"
        })
    } finally {
        creatingEnterprise.value = false
    }
}



enterprises.value = await getEnterprises()
/*  {
    "id": "2f9f321a-5a91-4cec-a3d0-f04b46c47ab6",
    "name": "New Enterprise",
    "description": null,
    "company_logo": null,
    "created_at": "2024-03-04T19:28:25.372Z",
    "updated_at": "2024-03-04T19:28:25.372Z"
} */

</script>

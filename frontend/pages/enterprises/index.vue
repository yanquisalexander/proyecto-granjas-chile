<template>
    <div class="bg-white p-4 rounded-md">
        <header class="flex my-6">
            <h1 class="text-xl font-medium">Empresas / PyMES</h1>
            <div class="flex-1"></div>
            <UButton @click="showCreateEnterpriseDialog">Crear Empresa</UButton>
        </header>


        <UTable :rows="enterprises" v-if="enterprises.length > 0" :columns="columns">
            <template #company_logo-data="{ row }">
                <img :src="row.company_logo" :alt="`Logo de ${row.name}`" class="h-8 w-8" />
            </template>

            <template #name-data="{ row }">
                <NuxtLink :to="`/enterprises/${row.id}`">
                    {{ row.name }}
                </NuxtLink>
            </template>

            <template #description-data="{ row }">
                {{ row.description ?? '-' }}
            </template>

            <template #created_at-data="{ row }">
                {{ new Date(row.created_at).toLocaleDateString() }}
            </template>

            <template #updated_at-data="{ row }">
                {{ new Date(row.updated_at).toLocaleDateString() }}
            </template>

            <template #actions-data="{ row }">
                <div class="flex space-x-2">
                    <UButton color="blue" variant="soft" :to="`/enterprises/${row.id}`">
                        <UIcon name="i-tabler-edit" />
                    </UButton>
                    <UButton color="red" variant="soft" @click="showDeleteEnterpriseDialog(row.id)">
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
                        <UButton type="button" color="blue" @click="createEnterprise" :loading="creatingEnterprise">
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
                    Introdcue el nombre de la empresa para confirmar la eliminación.
                </p>

                <UInput v-model="selectedEnterprise.name" label="Nombre de la empresa" class="p-4" />


                <template #footer>
                    <div class="flex justify-end space-x-4">
                        <UButton type="button" color="blue" variant="ghost" @click="showDeleteEnterprise = false">
                            Cancel
                        </UButton>
                        <UButton type="button" color="blue" @click="deleteEnterprise" :loading="deletingEnterprise"
                            :disabled="selectedEnterprise.name !== enterprises.find((enterprise) => enterprise.id === selectedEnterprise?.id)?.name">
                            <UIcon name="i-tabler-trash" />
                            Eliminar
                        </UButton>
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { Configuration } from "~/config";
import { type Enterprise } from "~/types";


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

const deleteEnterprise = async () => {
    deletingEnterprise.value = true
    try {
        const response = await fetch(`${Configuration.BACKEND_URL}/enterprise/${selectedEnterprise.value.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token.value
            }
        })

        if (response.ok) {
            toast.add({
                title: 'Empresa eliminada',
                description: 'La empresa ha sido eliminada exitosamente',
                color: "green",
                icon: "i-tabler-building"
            })
        } else {
            const res = await response.json()
            toast.add({
                title: 'Error al eliminar empresa',
                description: res.message,
                color: "red",
                icon: "i-tabler-building"
            })
        }

        showDeleteEnterprise.value = false
        await fetchEnterprises()
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
    try {
        const response = await fetch(`${Configuration.BACKEND_URL}/enterprise`, {
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


        await fetchEnterprises()
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

const fetchEnterprises = async () => {
    try {
        const res = await fetch(`${Configuration.BACKEND_URL}/enterprise`, {
            headers: {
                'Authorization': token.value
            }
        })
        const data = await res.json()
        enterprises.value = data
    } catch (error) {
        console.error(error)
    }
}

onMounted(async () => {
    await fetchEnterprises()
})

/*  {
    "id": "2f9f321a-5a91-4cec-a3d0-f04b46c47ab6",
    "name": "New Enterprise",
    "description": null,
    "company_logo": null,
    "created_at": "2024-03-04T19:28:25.372Z",
    "updated_at": "2024-03-04T19:28:25.372Z"
} */

</script>

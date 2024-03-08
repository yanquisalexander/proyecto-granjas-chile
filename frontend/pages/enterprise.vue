<template>
    <div class="bg-white p-4 rounded-md">
        <template v-if="!loading && enterprise">
            <header class="flex my-6">
                <h1 class="text-xl font-medium">
                    Mi Empresa
                </h1>
                <div class="flex-1"></div>
                <UButton to="/enterprise/edit" color="blue" variant="soft">
                    <UIcon name="i-tabler-edit" />
                    <span>Editar</span>
                </UButton>
            </header>

            <UTabs :items="tabs" class="w-full" @change="handleTabChange">
                <template #default="{ item, index, selected }">
                    <div class="flex items-center gap-2 relative truncate">
                        <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

                        <span class="truncate">{{ item.label }}</span>

                        <span v-if="selected"
                            class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                    </div>
                </template>
            </UTabs>

            <div class="mt-6">
                <NuxtPage />
            </div>


        </template>
        <div v-else-if="!loading && !enterprise">
            <p class="text-center mt-4">
                Parece que no tienes una empresa asignada. Pídele a tu administrador que te asigne una.
            </p>
        </div>
        <div v-else>
            <UProgress animation="carousel" color="blue" />
            <p class="text-center mt-4">Cargando...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Configuration } from "~/config";
import type { Enterprise } from "~/types";
const { token } = useAuth()
const toast = useToast()
const route = useRouter()

const enterprise = ref<Enterprise | null>(null)
const loading = ref(true)



const tabs = [{
    id: 'info',
    label: 'Información',
    icon: 'i-heroicons-information-circle',
    to: '/enterprise'
},
{
    id: 'users',
    label: 'Usuarios',
    icon: 'i-tabler-users',
    to: '/enterprise/users'
},
{
    id: 'workgroups',
    label: 'Grupos de trabajo',
    icon: 'i-tabler-briefcase',
    to: '/enterprise/workgroups'
}]

const currentTab = ref(tabs.find(tab => tab.to === route.currentRoute.value.path)?.id || 'info')

const handleTabChange = (tab: number) => {
    const selectedTab = tabs[tab]
    if (selectedTab.id === currentTab.value) return
    route.push(selectedTab.to)
    currentTab.value = selectedTab.id
}

const fetchMyEnterprise = async () => {
    if (!token.value) return
    try {
        loading.value = true
        const response = await fetch(`${Configuration.BACKEND_URL}/admin/enterprises/my-enterprise`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.value
            }
        })
        if (!response.ok) {
            throw new Error('Error al cargar la empresa')
        }
        const data = await response.json()
        enterprise.value = data
    } catch (error) {
        console.error(error)
        toast.add({
            title: 'Error al cargar la empresa',
            description: 'Ocurrió un error al cargar la empresa. Por favor, intenta de nuevo.',
            color: "red",
            icon: "i-tabler-alert-triangle"
        })

    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchMyEnterprise()
})


</script>

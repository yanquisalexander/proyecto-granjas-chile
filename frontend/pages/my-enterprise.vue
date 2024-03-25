<template>
    <div class="bg-white p-4 rounded-md">
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
    </div>
</template>

<script setup lang="ts">

const route = useRouter()


const tabs = [{
    id: 'info',
    label: 'Información',
    icon: 'i-heroicons-information-circle',
    to: '/my-enterprise'
},
{
    id: 'users',
    label: 'Usuarios',
    icon: 'i-tabler-users',
    to: '/my-enterprise/users'
},
{
    id: 'workgroups',
    label: 'Grupos de trabajo',
    icon: 'i-tabler-briefcase',
    to: '/my-enterprise/workgroups'
}]

const currentTab = ref(tabs.find(tab => tab.to === route.currentRoute.value.path)?.id || 'info')

const handleTabChange = (tab: number) => {
    const selectedTab = tabs[tab]
    if (selectedTab.id === currentTab.value) return
    route.push(selectedTab.to)
    currentTab.value = selectedTab.id
}




</script>

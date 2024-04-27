<template>
    <header class="flex items-center justify-between bg-white shadow-md top-0 w-full sticky h-16 z-50 p-4">
        <div class="h-full w-32 flex items-center mx-4">
            <Logo />
        </div>
        <div class="flex items-center">
            <UHorizontalNavigation :links="filteredHeaderLinks" />
        </div>
        <div class="flex-1" />
        <UPopover>
            <UButton color="white" :label="user?.username" trailing-icon="i-heroicons-chevron-down-20-solid" />

            <template #panel>
                <div class="p-4">
                    <div class="flex items-center space-x-2">
                        <UIcon name="i-tabler-user" class="text-gray-500" />
                        <span>{{ user?.username }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <UIcon name="i-tabler-mail" class="text-gray-500" />
                        <span>{{ user?.email }}</span>
                        <UButton color="white" @click="signOut({ callbackUrl: '/' })">Cerrar sesión</UButton>
                    </div>
                </div>
            </template>
        </UPopover>
    </header>
</template>

<script setup lang="ts">
const { getSession, signOut } = useAuth()

const user = await getSession()

const userHasEnterprise = computed(() => user?.enterprise !== null)
const userIsAdmin = computed(() => user?.roles.find((role: any) => role.name === "admin"))
const userIsSuperAdmin = computed(() => user?.roles.find((role: any) => role.name === "super_admin"))

const headerLinks = ref([
    {
        to: "/",
        label: "Inicio",
        icon: "i-fluent-home-32-regular",
        visible: true,
    },
    {
        to: "/admin/enterprises",
        label: "Empresas / PyMES",
        icon: "i-tabler-building",
        visible: userIsSuperAdmin.value,
    },
    {
        to: "/my-enterprise",
        label: "Mi Empresa",
        icon: "i-tabler-building",
        visible: userHasEnterprise.value && userIsAdmin.value,
    },
    {
        to: "/forms",
        label: "Formularios",
        icon: "i-tabler-file-text",
        visible: userHasEnterprise.value && userIsAdmin.value,
    },
    {
        to: "/admin/users",
        label: "Usuarios",
        icon: "i-tabler-users",
        visible: userIsSuperAdmin.value,
    },
    {
        to: "/profile",
        label: "Perfil",
        icon: "i-tabler-user",
    },
])

const filteredHeaderLinks = computed(() => headerLinks.value.filter((link) => link.visible))


</script>
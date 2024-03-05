<template>
    <v-navigation-drawer app elevation="0" mobile-breakpoint="lg" border="0" left>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->

        <v-list class="pa-4">
            <!---Menu Loop -->
            <template v-for="(item, index) in sidebarLinks" :key="index">
                <SidebarItem :item="item" v-if="item.visible" />
            </template>
        </v-list>
        <!-- ---------------------------------------------- -->
        <!---Logout -->
        <!-- ---------------------------------------------- -->
        <v-list class="pa-4">
            <v-list-item @click="logout">
                <v-list-item-action>
                    <v-icon>mdi-logout</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Cerrar Sesión</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

</template>

<script setup lang="ts">
import SidebarItem from "@/components/SidebarItem.vue";
const { getSession, signOut } = useAuth()

const user = await getSession()

const logout = () => {
    signOut({
        callbackUrl: '/login'
    })
}


console.log(user)

const sidebarLinks = ref([
    {
        title: 'Inicio',
        icon: 'i-fluent-home-32-regular',
        to: '/',
        visible: true
    },
    {
        title: 'Empresas / PyMES',
        icon: 'i-tabler-building',
        to: '/enterprises',
        visible: user.roles.find((role: any) => role.name === 'super_admin')
    },
    {
        title: 'Mi Empresa',
        icon: 'i-tabler-users-group',
        to: '/enterprise',
        visible: user.roles.find((role: any) => role.name === 'admin')
    },
    {
        title: 'Usuarios',
        icon: 'i-tabler-users',
        to: '/users',
        visible: user.roles.find((role: any) => role.name === 'super_admin')
    }
])
</script>
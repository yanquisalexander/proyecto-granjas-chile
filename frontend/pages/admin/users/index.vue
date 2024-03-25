<template>
    <div class="bg-white p-2 px-4 rounded-md">
        <header class="flex my-4">
            <h1 class="text-xl font-medium">
                Usuarios
            </h1>
            <div class="flex-1"></div>
            <UButton @click="showCreateEnterpriseDialog">Crear usuario</UButton>
        </header>

        <UAlert color="blue" title="Estás visualizando usuarios globales " variant="soft" icon="i-tabler-users-group"
            description="Como administrador global puedes ver y modificar todos los usuarios de la plataforma, independientemente de la empresa a la que pertenezcan." />

        <div class="mt-4">
            <template v-if="users.length === 0">
                <UAlert color="gray" title="No hay usuarios" variant="soft" icon="i-tabler-users"
                    description="No hay usuarios registrados en la plataforma." />
            </template>
            <template v-else>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="text-left">ID</th>
                                <th class="text-left">Nombre</th>
                                <th class="text-left">Correo</th>
                                <th class="text-left">Empresa</th>
                                <th class="text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{ user.id }}</td>
                                <td>{{ user.username }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.enterprise_name }}</td>
                                <td>
                                    <UButton @click="showEditEnterpriseDialog(user)">Editar</UButton>
                                    <UButton @click="showDeleteEnterpriseDialog(user)">Eliminar</UButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Configuration } from "~/config";
import axios from "axios";
const { getSession, token } = useAuth()

useHead({
    title: 'Usuarios',
})

const users = ref([])

const fetchUsers = async () => {
    try {
        const response = await axios(`${Configuration.BACKEND_URL}/admin/users`, {
            headers: {
                'Authorization': token.value
            }
        })
        console.log(response.data)
        users.value = response.data
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => {
    fetchUsers()
})
</script>
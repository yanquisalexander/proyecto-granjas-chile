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
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'auth'
})

useHead({
    title: 'Usuarios',
})
</script>
<template>
    <div class="bg-white p-2 px-4 rounded-md">

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
                    <img class="preview h-32" :src="imageToPreview || enterprise.company_logo"
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
                </UFormGroup>
                <footer class="flex justify-end mt-4">
                    <UButton color="blue" @click="updateEnterprise">
                        Guardar cambios
                    </UButton>
                </footer>
            </div>
        </template>
        <div v-else>
            <UProgress animation="carousel" color="blue" />
            <p class="text-center mt-4">Cargando...</p>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { Configuration } from "~/config";
import type { Enterprise } from "~/types";

const route = useRoute()
const { token } = useAuth()
const toast = useToast()

const imageToPreview = ref<string | null>(null)
const enterprise = ref<Enterprise | null>(null)
const editedEnterprise = ref<Enterprise | null>(null)

const copyEnterpriseIdToClipboard = () => {
    if (!editedEnterprise.value) return
    navigator.clipboard.writeText(editedEnterprise.value.id)
    toast.add({
        title: 'ID de empresa copiado',
        description: 'El ID de la empresa ha sido copiado al portapapeles',
        color: "green",
        icon: "i-tabler-check"
    })
}

const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return
    editedEnterprise.value.company_logo = file
    const reader = new FileReader()
    reader.onload = (e) => {
        imageToPreview.value = e.target?.result as string
    }

    reader.readAsDataURL(file)
}

const fetchEnterprise = async () => {
    const { id } = route.params
    console.log(id)
    if (!token.value) return
    const response = await fetch(`${Configuration.BACKEND_URL}/admin/enterprises/${id}`, {
        headers: {
            'Authorization': token.value
        }
    })
    const data = await response.json()
    enterprise.value = data
    editedEnterprise.value = { ...data }
}

const updateEnterprise = async () => {
    const { id } = route.params
    const formData = new FormData()
    if (!editedEnterprise.value || !enterprise.value) return
    for (const key in editedEnterprise.value) {
        if (editedEnterprise.value[key as keyof Enterprise] !== enterprise.value[key as keyof Enterprise]) {
            formData.append(key, editedEnterprise.value[key as keyof Enterprise])
        }
    }
    if (!token.value) return

    const response = await fetch(`${Configuration.BACKEND_URL}/admin/enterprises/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': token.value
        },
        body: formData
    })
    const data = await response.json()
    toast.add({
        title: 'Empresa actualizada',
        description: 'Los cambios han sido guardados',
        color: "green",
        icon: "i-tabler-check"
    })
    fetchEnterprise()
}

onMounted(() => {
    fetchEnterprise()
})
</script>
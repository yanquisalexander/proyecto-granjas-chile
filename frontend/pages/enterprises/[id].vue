<template>
    <div class="bg-white p-4 rounded-md">

        <template v-if="enterprise && editedEnterprise">
            <header class="flex my-6">
                <h1 class="text-xl font-medium">
                    Editando <em>{{ enterprise.name }}</em>
                </h1>
                <div class="flex-1"></div>
                <UButton to="/enterprises" color="gray" variant="soft">
                    <UIcon name="i-tabler-arrow-back" />
                    <span>Regresar</span>
                </UButton>
            </header>
            {{
            enterprise
        }}

            <div class="flex flex-col">
                <UFormGroup label="Nombre de la empresa" name="name">
                    <UInput v-model="editedEnterprise.name" />
                </UFormGroup>

                <UFormGroup label="Logo" name="logo">
                    <UInput type="file" accept="image/*" @change="e => editedEnterprise.logo = e.target.files[0]" />
                </UFormGroup>


                <UFormGroup label="Descripción" name="description">
                    <UTextarea v-model="editedEnterprise.description" />
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

const enterprise = ref<Enterprise | null>(null)
const editedEnterprise = ref<Enterprise | null>(null)

const fetchEnterprise = async () => {
    const { id } = route.params
    console.log(id)
    const response = await fetch(`${Configuration.BACKEND_URL}/enterprise/${id}`, {
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
    if (!editedEnterprise.value) return
    formData.append('name', editedEnterprise.value.name)
    formData.append('description', editedEnterprise.value.description)
    formData.append('logo', editedEnterprise.value.logo)

    const response = await fetch(`${Configuration.BACKEND_URL}/enterprise/${id}`, {
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
<template>
  <div>
    <div v-if="loading">
      <UProgress animation="carousel" color="blue" />
      <p class="text-center mt-4">Cargando...</p>
    </div>
    <div v-else-if="!enterprise">
      <p class="text-center mt-4">
        Parece que no tienes una empresa asignada. Pídele a tu administrador que te asigne una.
      </p>
    </div>
    <div v-else>
      <div class="flex flex-col space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-medium">Mi Empresa</h1>
          <div class="flex items-center space-x-2">
            <UButton @click="editingEnterpriseDetails = !editingEnterpriseDetails" variant="soft" color="gray"
              icon="i-tabler-edit">
              {{ editingEnterpriseDetails ? 'Cancelar' : 'Editar' }}
            </UButton>
          </div>
        </div>
        <UFormGroup label="ID de Empresa" name="id">
          <div class="flex items-center w-full">
            <UInput v-model="enterprise.id" disabled class="flex-1" />
            <UButton variant="soft" color="gray" @click="copyEnterpriseIdToClipboard">
              <UIcon name="i-tabler-copy" />
            </UButton>
          </div>
        </UFormGroup>

        <UFormGroup label="Nombre de la empresa" name="name">
          <UInput v-model="enterpriseEdited.name" :disabled="!editingEnterpriseDetails" />
        </UFormGroup>

        <UFormGroup label="Logo" name="logo">
          <img class="preview h-32" :src="imageToPreview || enterpriseEdited.company_logo"
            :alt="`Logo de ${enterprise.name}`" />
          <UInput type="file" accept="image/*" @change="handleImageChange" :disabled="!editingEnterpriseDetails" />
        </UFormGroup>


        <UFormGroup label="Descripción" name="description">
          <UTextarea v-model="enterpriseEdited.description" autoresize :disabled="!editingEnterpriseDetails" />
        </UFormGroup>


        <UFormGroup label="Última actualización" name="updated_at">
          <p>{{ new Date(enterpriseEdited.updated_at).toLocaleDateString() }}</p>
        </UFormGroup>


        <footer class="flex justify-end mt-4" v-if="editingEnterpriseDetails">
          <UButton color="blue" @click="updateEnterprise">
            Guardar cambios
          </UButton>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Configuration } from "~/config";
import type { Enterprise } from "~/types";

const { token } = useAuth()
const toast = useToast()

const enterprise = ref<Enterprise | null>(null)
const enterpriseEdited = ref<Enterprise | null>(null)
const loading = ref(true)
const editingEnterpriseDetails = ref(false)
const imageToPreview = ref<string | null>(null)

const copyEnterpriseIdToClipboard = () => {
  if (!enterprise.value) return
  navigator.clipboard.writeText(enterprise.value.id)
  toast.add({
    title: 'ID de empresa copiado',
    description: 'El ID de la empresa ha sido copiado al portapapeles',
    color: "green",
    icon: "i-tabler-check"
  })
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
    enterpriseEdited.value = { ...data }
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

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  enterpriseEdited.value.company_logo = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imageToPreview.value = e.target?.result as string
  }

  reader.readAsDataURL(file)
}

const updateEnterprise = async () => {
  const formData = new FormData()
  if (!enterpriseEdited.value || !enterpriseEdited.value) return
  for (const key in enterpriseEdited.value) {
    if (enterpriseEdited.value[key as keyof Enterprise] !== enterprise.value[key as keyof Enterprise]) {
      formData.append(key, enterpriseEdited.value[key as keyof Enterprise])
    }
  }
  if (!token.value) return

  const response = await fetch(`${Configuration.BACKEND_URL}/admin/enterprises/my-enterprise`, {
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
  editingEnterpriseDetails.value = false
  fetchMyEnterprise()
}

onMounted(() => {
  fetchMyEnterprise()
})


</script>
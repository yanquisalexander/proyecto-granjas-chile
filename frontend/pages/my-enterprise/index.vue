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
        {{ enterprise }}
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { Configuration } from "~/config";
import type { Enterprise } from "~/types";

const { token } = useAuth()
const toast = useToast()

const enterprise = ref<Enterprise | null>(null)
const loading = ref(true)

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
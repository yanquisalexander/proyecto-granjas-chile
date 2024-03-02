<template>
    <div class="min-h-screen flex w-full flex-col justify-center items-center">
        <div class="min-w-72 mx-4 shadow-md border border-solid rounded-lg p-4 py-12">
            <header class="text-center my-6">
                <img src="/images/granja-regando.webp" alt="Logo sitio administradores" class="w-20 mx-auto" />
                <h1 class="text-xl font-bold">
                    Sign in
                </h1>
                <p class="text-sm text-gray-600">
                    You are trying to access a protected page
                </p>
            </header>
            <UForm :state="state" class="space-y-4 w-full" @submit="handleSubmit">
                <UFormGroup label="Email" name="email">
                    <UInput v-model="state.email" />
                </UFormGroup>

                <UFormGroup label="Password" name="password">
                    <UInput v-model="state.password" type="password" />
                </UFormGroup>


                <UButton type="submit" :loading="loading">
                    Submit
                </UButton>
            </UForm>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FetchResult } from "#app";

const { signIn } = useAuth()

const state = reactive({
    email: '',
    password: ''
})

watch(() => state.email, (newVal) => {
    console.log(newVal)
})

const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
    loading.value = true
    try {
        const res = await signIn({
            email: state.email,
            password: state.password
        }, {
            callbackUrl: '/'
        })



        console.log("res", res)
    } catch (e) {
        console.log("error", (e as any).response._data.message)
        error.value = (e as any).response._data.message
        const toast = useToast()
        toast.add({
            title: 'Authentication error',
            description: (e as any).response._data.message,
            color: "red",
            icon: "i-tabler-face-id-error"
        })
    } finally {
        loading.value = false
    }



}

definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/'
    }
})
</script>
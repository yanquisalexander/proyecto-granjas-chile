<template>
    <div
        class="min-h-screen flex w-full flex-col justify-center items-center bg-[url('/images/bg-login.png')] bg-cover bg-center bg-no-repeat">
        <div class="min-w-72 mx-4 shadow-md border border-solid rounded-lg p-4 py-12 bg-white dark:bg-gray-800">
            <header class="text-center my-6">
                <img draggable="false" src="/images/granja-regando.webp" alt="Logo sitio administradores"
                    class="w-20 mx-auto" />
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

                <div class="flex space-x-4 justify-center">

                    <UButton type="submit" :loading="loading">
                        Sign in
                    </UButton>

                    <UButton type="button" variant="ghost" @click="dialogResetPassword = true">
                        Reset password
                    </UButton>
                </div>
            </UForm>
        </div>

        <USelect v-model="state.language" :options="languages" option-attribute="name" label="Language" class="mt-4" />


        <UModal v-model="dialogResetPassword">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h2 class="text-xl font-bold">
                        Reset password
                    </h2>
                </template>

                <p class="p-4">
                    Si tu cuenta existe, y tiene acceso de administrador, se enviará un correo con un enlace para
                    restablecer tu
                    contraseña.
                </p>

                <p class="p-4">
                    El correo ingresado es: <strong>{{ state.email }}</strong>
                </p>



                <template #footer>
                    <div class="flex justify-end space-x-4">
                        <UButton type="button" color="blue" variant="ghost" @click="dialogResetPassword = false">
                            Cancel
                        </UButton>
                        <UButton type="button" color="blue" @click="sendResetPassword">
                            Reset
                        </UButton>
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">

const { signIn } = useAuth()

const state = reactive({
    email: '',
    password: '',
    language: 'en'
})

watch(() => state.email, (newVal) => {
    console.log(newVal)
})

const loading = ref(false)
const dialogResetPassword = ref(false)
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
        const toast = useToast()
        console.log("e", e)
        const errorMessage = (e as any).response?._data?.message || 'Error al conectarse al servidor'
        toast.add({
            title: 'Authentication error',
            description: errorMessage,
            color: "red",
            icon: "i-tabler-face-id-error"
        })
    } finally {
        loading.value = false
    }
}

const sendResetPassword = () => {
    console.log("sendResetPassword")
    dialogResetPassword.value = false
}

const languages = ref([
    {
        name: 'English',
        value: 'en'
    }, {
        name: 'Spanish',
        value: 'es'
    }
])

definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/'
    }
})
</script>
<template>
    <div class="min-h-screen flex w-full flex-col justify-center items-center">
        <div class="">
            <UForm :state="state" class="space-y-4" @submit="handleSubmit">
                <UFormGroup label="Email" name="email">
                    <UInput v-model="state.email" />
                </UFormGroup>

                <UFormGroup label="Password" name="password">
                    <UInput v-model="state.password" type="password" />
                </UFormGroup>

                <UButton type="submit">
                    Submit
                </UButton>
            </UForm>
        </div>
    </div>
</template>

<script setup lang="ts">
const { signIn } = useAuth()

const state = reactive({
    email: '',
    password: ''
})

watch(() => state.email, (newVal) => {
    console.log(newVal)
})

const handleSubmit = async () => {
    try {
        const res = await signIn({
            email: state.email,
            password: state.password
        }, {
            callbackUrl: '/'
        })



        console.log("res", res)
    } catch (error) {
        console.log("error", error)
    }



}

definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/'
    }
})
</script>
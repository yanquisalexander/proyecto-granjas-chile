<template>
    <PageContainer>
        <header class="flex my-4">
            <h1 class="text-xl font-medium flex items-center">
                <UIcon name="i-tabler-users-group" class="w-6 h-6 mr-2" />
                Grupos de Trabajo
            </h1>
            <div class="flex-1"></div>
        </header>

        <div class="my-4 flex flex-col">
            <template v-for="workGroup in workGroups" :key="workGroup.id">
                <div class="flex items-center my-2 p-4 rounded-md bg-gray-100 dark:bg-gray-800">
                    <div class="flex items-center gap-4">
                        <div class="w-8 h-8 flex items-center justify-center rounded-full"
                            :class="randomColorClass().class">
                            <UIcon name="i-tabler-users" />
                        </div>
                        <div>
                            <h2 class="text-lg font-medium">{{ workGroup.title }}</h2>
                        </div>
                    </div>
                </div>

            </template>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
import axios from "axios";
const { token } = useAuth()

const workGroups = ref([])

const randomColorClass = () => {
    const colors = [
        {
            name: 'blue',
            class: 'bg-blue-100 text-blue-500'
        },
        {
            name: 'green',
            class: 'bg-green-100 text-green-500'
        },
        {
            name: 'red',
            class: 'bg-red-100 text-red-500'
        },
        {
            name: 'yellow',
            class: 'bg-yellow-100 text-yellow-500'
        },
        {
            name: 'indigo',
            class: 'bg-indigo-100 text-indigo-500'
        },
        {
            name: 'purple',
            class: 'bg-purple-100 text-purple-500'
        },
        {
            name: 'pink',
            class: 'bg-pink-100 text-pink-500'
        }
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}

const fetchWorkGroups = async () => {
    try {
        const { data } = await axios('https://fakestoreapi.com/products')
        console.log(data)
        workGroups.value = data
    } catch (error) {
        console.error(error)
    }
}

const createWorkgroup = () => {
    console.log("createWorkgroup")
}

onMounted(() => {
    fetchWorkGroups()
})
</script>
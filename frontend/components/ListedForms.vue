<template>
    <div class="flex flex-col gap-6">
        <template v-for="form in props.forms" :key="form.id">
            <NuxtLink
                class="flex items-center gap-2 py-4 px-2 relative truncate transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                :to="`/forms/${form.id}`">
                <div class="flex items-center gap-2">
                    <UIcon name="i-tabler-file-text" class="w-4 h-4 flex-shrink-0" />
                    <span class="truncate">{{ form.title }}</span>
                    <FormStatusBadge :status="form.form_status" />
                </div>
                <div class="flex flex-1" />
                <div class="flex items-center gap-2">
                    <UButton icon="i-tabler-edit" :to="`/forms/${form.id}`" />
                </div>

            </NuxtLink>
        </template>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    forms: any[]
}>()
</script>
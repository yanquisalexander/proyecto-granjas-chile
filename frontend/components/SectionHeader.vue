<template>
    <header class="flex my-4">
        <h1 class="text-xl font-medium">
            {{ props.title }}
        </h1>
        <div class="flex-1" />
        <slot name="actions" />
    </header>
</template>

<script setup lang="ts">
const props = defineProps<{
    title?: string
}>()
</script>
<template>
    <span class="px-2 py-1 text-xs font-semibold leading-none text-white rounded-full" :class="{
        'bg-green-500': props.status === 'published',
        'bg-yellow-500': props.status === 'draft',
        'bg-red-500': props.status === 'archived',
        'bg-gray-500': props.status === 'deleted'
    }">
        {{ statusText() }}
    </span>
</template>

<script setup lang="ts">
const props = defineProps<{
    status: 'published' | 'draft' | 'archived' | 'deleted'
}>()

const statusText = () => {
    switch (props.status) {
        case 'published':
            return 'Publicado'
        case 'draft':
            return 'Borrador'
        case 'archived':
            return 'Archivado'
        case 'deleted':
            return 'Eliminado'
    }
}
</script>
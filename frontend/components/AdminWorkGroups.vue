<template>
    {{ props.enterprise }}
</template>

<script setup lang="ts">
import { type Enterprise } from "~/types";

const props = defineProps<{
    enterprise: Enterprise
}>()
</script>
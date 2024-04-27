<template v-if="problems">
    <div v-for="problem in problems" :key="problem.id"
        class="gap-4 flex flex-col w-full items-center justify-center mt-4">
        <UAlert variant="soft" :title="problem.title" :description="problem.message" :color="problem.color"
            :icon="problem.icon ?? 'i-tabler-alert-triangle'" />
    </div>
</template>

<script setup lang="ts">
const { getProblems } = useDashboard()

const problems = ref([])
problems.value = await getProblems()
</script>
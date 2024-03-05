<template>
    <div>
        <h1>Enterprise > Workgroups</h1>
    </div>

</template>

<script setup lang="ts">
const { token } = useAuth()

const state = reactive({
    workgroups: []
})

const createWorkgroup = () => {
    console.log("createWorkgroup")
}
</script>
<template>
    <PageContainer>
        <SectionHeader title="Formularios">
            <template #actions>
                <div class="flex items-center gap-2">
                    <UInput v-model="search" placeholder="Buscar formulario" icon="i-tabler-search" />
                    <USelect v-model="currentFormFilter" :options="filterOptions" />
                </div>
                <UButton icon="i-tabler-plus" class="ml-2" @click="showCreateFormDialog = true">
                    Crear formulario
                </UButton>
            </template>
        </SectionHeader>
        <ListedForms :forms="filteredForms" />
        <LazyCreateForm v-model="showCreateFormDialog" @create-form="handleCreateForm" />
    </PageContainer>
</template>

<script setup lang="ts">
const { getForms, createForm } = useSelfEnterprise()
const search = ref<string>('')
const showCreateFormDialog = ref<boolean>(false)
const currentFormFilter = ref<any>('all')
const filterOptions = ref<any[]>([
    { label: 'Todos', value: 'all' },
    { label: 'Publicados', value: 'published' },
    { label: 'Borradores', value: 'draft' },
    { label: 'Archivados', value: 'archived' }
])


const forms = ref<any[]>([])


try {
    forms.value = await getForms()
} catch (error) {
    console.error(error)
}

watch(currentFormFilter, async (value) => {
    if (value === 'all') {
        forms.value = await getForms()
    } else {
        forms.value = await getForms(value)
    }
})

const filteredForms = computed(() => {
    return forms.value.filter((form) => {
        if (currentFormFilter.value === 'all') {
            return form.title.toLowerCase().includes(search.value.toLowerCase())
        }
        return form.title.toLowerCase().includes(search.value.toLowerCase()) && form.form_status === currentFormFilter.value
    })
})

const handleCreateForm = async (newForm: any) => {
    try {
        console.log(newForm)
        await createForm(newForm)
        showCreateFormDialog.value = false
        forms.value = await getForms()
    } catch (error) {
        console.error(error)
    }
}

</script>
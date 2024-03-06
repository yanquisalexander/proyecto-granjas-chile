<template>
    <div class="min-h-screen w-full flex flex-col items-center">
        <header>
            <h1>
                Prueba librería DnD
            </h1>
        </header>

        <div class="contenedor grid grid-cols-2 md:grid-cols-3" ref="contenedor">
            <template v-for="(item, i) in itemsDrag" :key="i">
                <div class="item p-8 m-4 bg-white shadow-lg text-xl">
                    <img :src="item.thumbnail" :alt="item.title" class="w-full h-48 object-cover" />
                    <h2 class="text-center">{{ item.title }}</h2>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const items = ref<any[]>([]);

items.value = await fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => data.products);


const [contenedor, itemsDrag] = useDragAndDrop(items.value);

onMounted(() => {
    console.log(contenedor.value)
})

watch(itemsDrag, (newItems, oldItems) => {
    // Show the difference between the new and old item, for example Item 1 moved to position 2
    const diff = newItems
        .map((item, i) => (item !== oldItems[i] ? `Producto ${i + 1} movido a posición ${oldItems.indexOf(item) + 1}` : null))
        .filter(Boolean);
    console.log(diff);
    console.table(newItems);
})
</script>
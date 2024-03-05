<script setup lang="ts">

const props = defineProps(
    {
        item: {
            type: Object,
            required: true,
        },
        level: {
            type: Number,
            default: 0,
        },

    }
);
</script>

<template>
    <!---Single Item-->
    <v-list-item :to="item.type === 'external' ? '' : item.to" :href="item.type === 'external' ? item.to : ''"
        class="mb-1 !rounded-[12px]" color="primary" :disabled="item.disabled" active-class="font-medium"
        :target="item.type === 'external' ? '_blank' : ''">
        <!---If icon-->
        <template v-slot:prepend>
            <UIcon :name="item.icon" class="mr-2 text-xl" v-if="item.icon" :size="item.iconSize"
                :color="item.iconColor" />
        </template>
        <v-list-item-title>
            {{ item.title }}
        </v-list-item-title>
        <!---If Caption-->
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
            {{ item.subCaption }}
        </v-list-item-subtitle>
        <!---If any chip or label-->

        <template v-slot:append v-if="item.chip">
            <v-chip :color="item.chipColor" class="sidebarchip hide-menu" :size="item.chipIcon ? 'small' : 'default'"
                :variant="item.chipVariant" :prepend-icon="item.chipIcon">
                {{ item.chip }}
            </v-chip>
        </template>
    </v-list-item>
</template>
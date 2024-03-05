<template>
    <div class="min-h-screen">
        <Sidebar />
        <Header />
        <v-main class="flex w-full min-h-screen">
            <v-container fluid class="bg-gray-100 rounded-lg md:!mr-4">
                <slot />
            </v-container>
        </v-main>
    </div>
</template>
<template>
    <div class="min-h-screen">
        <main class="w-full min-h-screen bg-gray-100">
            <Header />

            <UContainer class="w-full rounded-md p-4">
                <slot />
            </UContainer>
        </main>
    </div>
</template>
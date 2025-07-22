<template>
  <div
    class="auth-layout"
  >
    <div class="surface-200 text-gray-900 p-4 w-22rem border-round-2xl">
      <h2 class="text-2xl font-bold mb-4 text-center">{{ cardTitle }}</h2>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  cardTitle: string
}>();
</script>

<style scoped>
.auth-layout {
  background-image: url("../../../assets/images/auth-bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f0f0f0;
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
}
</style>

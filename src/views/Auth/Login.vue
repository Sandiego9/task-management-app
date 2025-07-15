<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Login Page</h2>
    <Button label="Click Me" @click="sayHello" />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button"

function sayHello() {
  alert('Vue + TS + PrimeVue setup is working!');
}
</script>

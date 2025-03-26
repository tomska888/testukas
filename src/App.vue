<template>
  <div :class="{ 'onboarding': $route.path === '/onboarding' }" class="app1">
    <router-view />
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

watch(route, (newRoute) => {
  if (newRoute.path === '/onboarding') {
    document.body.classList.add('route-onboarding');
  } else {
    document.body.classList.remove('route-onboarding');
  }
}, { immediate: true });
</script>
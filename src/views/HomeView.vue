<template>
  <div>
    <h1>Habit Tracker</h1>
    <DayNavigation :selectedDate="selectedDate" @update-error="handleError" />
    <p v-if="showError" class="error-message">Future dates are not allowed.</p>
    <router-link to="/add-habit"><button id="addHabit">Add Habit</button></router-link>
    <HabitList />
  </div>
</template>

<script setup>
import HabitList from '../components/HabitList.vue';
import DayNavigation from '../components/DayNavigation.vue';
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const selectedDate = ref(route.params.date || new Date().toISOString().slice(0, 10));
const showError = ref(false);

const navigateToToday = () => {
  const today = new Date().toISOString().slice(0, 10);

  setTimeout(() => {
    showError.value = false;
  }, 2000);

  setTimeout(() => {
    router.replace(`/day/${today}`);
    selectedDate.value = today;
  }, 2000);
};


const handleError = (errorState) => {
  showError.value = errorState;
};

watch(
  () => route.params.date,
  (newDate) => {
    const today = new Date().toISOString().slice(0, 10);
    selectedDate.value = newDate;

    if (newDate > today) {
      showError.value = true;
      navigateToToday();
    } else {
      showError.value = false;
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (selectedDate.value > new Date().toISOString().slice(0, 10)) {
    showError.value = true;
    navigateToToday();
  }
});
</script>

<style scoped>
</style>
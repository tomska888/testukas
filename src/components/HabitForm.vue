<template>
  <form @submit.prevent="submitForm">
    <div class="form-group">
      <label for="habitName">Habit Name:</label>
      <input type="text" id="habitName" v-model="habitName" @input="clearError" placeholder="Habit Name"/>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>

    <CategorySelector ref="categorySelector" v-model:selectedCategory="selectedCategory" />

    <div class="button-group">
      <button type="button" @click="goToMainPage">Back to Main</button>
      <button type="submit">Add Habit</button>
    </div>
  </form>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { habits, addHabit } from '../stores/habits';
import CategorySelector from './CategorySelector.vue';
import { useRouter } from 'vue-router';

const habitName = ref('');
const categorySelector = ref(null);
const selectedCategory = ref(null);
const errorMessage = ref('');
const router = useRouter();

const clearError = () => {
  errorMessage.value = '';
};

const goToMainPage = () => {
  router.push('/');
};

const submitForm = async () => {
  if (!habitName.value.trim()) {
    errorMessage.value = 'Please enter a habit name.';
    return;
  }

  const isDuplicate = habits.some(habit => habit.name.toLowerCase() === habitName.value.trim().toLowerCase());

  if (isDuplicate) {
    errorMessage.value = 'Habit name already exists. Please choose a different name.';
    return;
  }

  await nextTick();

  if (!selectedCategory.value) {
    errorMessage.value = 'Please select a category.';
    return;
  }

  addHabit({
    id: Date.now(),
    name: habitName.value.trim(),
    categoryId: selectedCategory.value,
    records: [],
  });

  habitName.value = '';
  selectedCategory.value = null;
  errorMessage.value = '';

  router.push('/');
};
</script>

<style scoped>
</style>

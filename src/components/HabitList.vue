<template>
  <div>
    <div v-if="isFutureDate">
      <p class="error-message">Habits cannot be marked for future dates.</p>
    </div>
    <div v-else v-for="category in categorizedHabits" :key="category.id">
      <h2>{{ category.name }}</h2>
      <ul>
        <li v-for="habit in category.habits" :key="habit.id">
          <div class="nameCheck">
            <span :class="{ completed: habit.completed }">{{ habit.name }}</span>
            <input type="checkbox" id="checkbox" v-model="habit.completed" @change="toggleCompletion(habit.id, habit.completed)" />
          </div>
          <div class="editDelete">
            <button @click="editHabitHandler(habit)" id="editHabit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 15.5l-2.3 2.3L3 12.5V8a6 6 0 0 1 6-6z"/><path d="M15 5v2h2"/><path d="M3.293 17.566a2.4 2.4 0 0 1 0-3.394l8.607-8.607 1.5 1.5-8.607 8.607z"/></svg>
            </button>
            <button @click="deleteHabitHandler(habit.id)" id="deleteHabit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="editingHabit" class="modal">
      <div class="modal-content">
        <h2>Edit Habit</h2>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div class="habitName2">
          <label for="habitName">Habit Name:</label>
          <input type="text" id="habitName1" v-model="editingHabit.name" @input="clearError" />
        </div>
        <div class="category2">
          <label for="category">Category:</label>
          <select id="category1" v-model="editingHabit.categoryId">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div class="button-group">
          <button @click="editingHabit = null">Cancel</button>
          <button @click="saveEditedHabit">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { categories, markHabitCompletion, getHabitsForDate, editHabit, deleteHabit } from '../stores/habits';
import { useRoute } from 'vue-router';

const route = useRoute();
const selectedDate = ref(route.params.date || new Date().toISOString().slice(0, 10));
const editingHabit = ref(null);
const errorMessage = ref('');

const clearError = () => {
  errorMessage.value = '';
};

const habitsForDate = computed(() => {
  return getHabitsForDate(selectedDate.value);
});

const categorizedHabits = computed(() => {
  if (!categories || categories.length === 0) {
    return [];
  }
  const categorized = {};
  categories.forEach((category) => {
    categorized[category.id] = { ...category, habits: [] };
  });
  habitsForDate.value.forEach((habit) => {
    if (categorized[habit.categoryId]) {
      categorized[habit.categoryId].habits.push(habit);
    }
  });
  return Object.values(categorized);
});

const toggleCompletion = (habitId, completed) => {
  markHabitCompletion(habitId, selectedDate.value, completed);
};

const isFutureDate = computed(() => {
  return new Date(selectedDate.value) > new Date().toISOString().slice(0, 10);
});

const isDuplicate = (habitName) => {
  return categorizedHabits.value.some(category =>
    category.habits.some(habit => habit.name.toLowerCase() === habitName.toLowerCase())
  );
};

const editHabitHandler = (habit) => {
  editingHabit.value = { ...habit };
};

const saveEditedHabit = () => {
  if (isDuplicate(editingHabit.value.name)) {
    errorMessage.value = 'Habit name already exists. Please choose a different name.';

    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
    return;
  }

  editHabit(editingHabit.value);
  editingHabit.value = null;
  errorMessage.value = '';
};

const deleteHabitHandler = (habitId) => {
  if (confirm('Are you sure you want to delete this habit?')) {
    deleteHabit(habitId);
  }
};

watch(
  () => route.params.date,
  (newDate) => {
    selectedDate.value = newDate || new Date().toISOString().slice(0, 10);
  }
);
</script>

<style scoped>
</style>
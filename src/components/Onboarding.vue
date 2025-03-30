<template>
  <div class="modal" v-if="showOnboarding">
    <div class="modal-content">
      <h2>{{ steps[currentStep].title }}</h2>
      <p>{{ steps[currentStep].description }}</p>

      <div v-if="currentStep === 0">
        <p>Track your daily habits and stay on top of your goals!</p>
      </div>
      <div v-if="currentStep === 1">
        <p>Use the navigation arrows to check habits for previous days.</p>
      </div>
      <div v-if="currentStep === 2" id="onboardCate">
        <input type="text" v-model="newCategoryName" id="onboardCatText" placeholder="Enter Category Name" />
        <button @click="addCategoryHandler" id="onboardAddCat">Add Category</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
      <div v-if="currentStep === 3" id="onboardHabit">
        <input
          type="text"
          v-model="habitName"
          id="onboardHabitText"
          placeholder="Enter Habit Name"
          :disabled="habitAdded"
        />
        <button
          v-if="!habitAdded"
          @click="addHabitHandler"
          id="onboardAddHabit"
        >
          Add Habit
        </button>
        <p v-if="habitAdded" class="success-message">Habit successfully added. Please finish onboarding.</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <div class="button-group">
        <button v-if="currentStep > 0" @click="prevStep">Previous</button>
        <button v-if="currentStep < steps.length - 1" @click="nextStep">Next</button>
        <button v-if="currentStep === steps.length - 1" @click="completeOnboarding">Finish</button>
        <button v-if="currentStep < steps.length - 1" @click="skipOnboarding">Skip</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { categories, addCategory, addHabit } from '../stores/habits';

const router = useRouter();

const showOnboarding = ref(true);
const currentStep = ref(0);

const steps = [
  { title: 'Welcome to Habit Tracker', description: '' },
  { title: 'Navigate Days', description: '' },
  { title: 'Add a Category', description: 'Create a category to organize your habits.' },
  { title: 'Add a Habit', description: 'Add a habit to the category you created.' },
];

const newCategoryName = ref('');
const selectedCategoryId = ref(null);
const habitName = ref('');
const errorMessage = ref('');
const habitAdded = ref(false);

const nextStep = () => {
  if (currentStep.value < steps.length - 1) currentStep.value += 1;
};

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value -= 1;
};

const addCategoryHandler = () => {
  if (!newCategoryName.value.trim()) {
    errorMessage.value = 'Please enter a category name.';
    return;
  }

  const isDuplicate = categories.some(
    (cat) => cat.name.toLowerCase() === newCategoryName.value.trim().toLowerCase()
  );

  if (isDuplicate) {
    errorMessage.value = 'Category name already exists.';
    return;
  }

  const newCategory = { id: Date.now(), name: newCategoryName.value.trim() };
  addCategory(newCategory);

  selectedCategoryId.value = newCategory.id;

  currentStep.value += 1;
  newCategoryName.value = '';
  errorMessage.value = '';
};

const addHabitHandler = () => {
  if (habitAdded.value) {
    errorMessage.value = 'Only one habit can be added during onboarding.';
    return;
  }

  if (!habitName.value.trim()) {
    errorMessage.value = 'Please enter a habit name.';
    return;
  }

  const isDuplicate = categories.some(
    (habit) => habit.name.toLowerCase() === habitName.value.trim().toLowerCase()
  );

  if (isDuplicate) {
    errorMessage.value = 'Habit name already exists.';
    return;
  }

  addHabit({
    id: Date.now(),
    name: habitName.value.trim(),
    categoryId: selectedCategoryId.value,
    records: [],
  });

  habitAdded.value = true;
  habitName.value = '';
  errorMessage.value = '';
};

const completeOnboarding = () => {
  showOnboarding.value = false;
  localStorage.setItem('onboardingComplete', 'true');
  router.push('/');
};

const skipOnboarding = () => {
  showOnboarding.value = false;
  localStorage.setItem('onboardingComplete', 'true');
  router.push('/');
};
</script>

<style scoped>
</style>
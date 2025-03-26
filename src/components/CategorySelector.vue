<template>
  <div class="form-group-2">
    <label for="category" id="categoryLabel">Category:</label>
    <select id="category" v-model="selectedCategory" @change="emitCategory">
      <option disabled :value="null">Select a category</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
    <button @click="isModalOpen = true" id="manageCategory">Manage Categories</button>

    <div v-if="isModalOpen" class="category-modal">
      <h2>Manage Categories</h2>
      <div class="new-category">
        <input type="text" v-model="newCategoryName" id="addCategory" placeholder="New Category Name" />
        <button @click="addCategoryHandler">Add Category</button>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <ul>
        <li v-for="category in categories" :key="category.id">
          <span>{{ category.name }}</span>
          <div>
            <button @click="editCategoryHandler(category)">Edit</button>
            <button @click="deleteCategoryHandler(category.id)">Delete</button>
          </div>
        </li>
      </ul>

      <button @click="isModalOpen = false">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { categories, addCategory, editCategory, deleteCategory } from '../stores/habits';

const selectedCategory = ref(null);
const isModalOpen = ref(false);
const newCategoryName = ref('');
const errorMessage = ref('');
const emit = defineEmits(['update:selectedCategory']);

const emitCategory = () => {
  emit('update:selectedCategory', selectedCategory.value);
};

const addCategoryHandler = () => {
  if (!newCategoryName.value.trim()) {
    errorMessage.value = 'Please enter a category name.';
    return;
  }

  const isDuplicate = categories.some(cat => cat.name.toLowerCase() === newCategoryName.value.trim().toLowerCase());

  if (isDuplicate) {
    errorMessage.value = 'Category name already exists. Please choose a different name.';
    return;
  }

  const newCategory = { id: Date.now(), name: newCategoryName.value.trim() };
  addCategory(newCategory);

  selectedCategory.value = newCategory.id;
  emitCategory();

  newCategoryName.value = '';
  errorMessage.value = '';
};

const editCategoryHandler = (category) => {
  const newName = prompt('Enter new category name', category.name);
  if (newName) {
    const isDuplicate = categories.some(cat => cat.name.toLowerCase() === newName.trim().toLowerCase());

    if (isDuplicate) {
      alert('Category name already exists. Please choose a different name.');
      return;
    }

    editCategory({ ...category, name: newName.trim() });
  }
};

const deleteCategoryHandler = (categoryId) => {
  deleteCategory(categoryId);

  if (selectedCategory.value === categoryId) {
    selectedCategory.value = null;
    emitCategory();
  }
};
</script>

<style scoped>
</style>
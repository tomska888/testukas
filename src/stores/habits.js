import { reactive } from 'vue';

export const habits = reactive(JSON.parse(localStorage.getItem('habits')) || []);
export const categories = reactive(JSON.parse(localStorage.getItem('categories')) || []);

function updateLocalStorage() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('categories', JSON.stringify(categories));
}

export function addHabit(habit) {
    habits.push({ ...habit, records: [] });
    updateLocalStorage();
}

export function editHabit(updatedHabit) {
    const index = habits.findIndex((habit) => habit.id === updatedHabit.id);
    if (index !== -1) {
        habits[index] = updatedHabit;
        updateLocalStorage();
    }
}

export function deleteHabit(habitId) {
    const index = habits.findIndex((habit) => habit.id === habitId);
    if (index !== -1) {
        habits.splice(index, 1);
        updateLocalStorage();
    }
}

export function markHabitCompletion(habitId, date, completed) {
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
        const recordIndex = habit.records.findIndex((r) => r.date === date);
        if (recordIndex !== -1) {
            habit.records[recordIndex].completed = completed;
        } else {
            habit.records.push({ date, completed });
        }
        updateLocalStorage();
    }
}

export function getHabitsForDate(date) {
    return habits.map((habit) => {
        const record = habit.records.find((r) => r.date === date);
        return {
            ...habit,
            completed: record ? record.completed : false,
        };
    });
}

export function addCategory(category) {
    categories.push(category);
    updateLocalStorage();
}

export function editCategory(updatedCategory) {
    const index = categories.findIndex((category) => category.id === updatedCategory.id);
    if (index !== -1) {
        categories[index] = updatedCategory;
        updateLocalStorage();
    }
}

export function deleteCategory(categoryId) {
    const index = categories.findIndex((category) => category.id === categoryId);
    if (index !== -1) {
        categories.splice(index, 1);
        updateLocalStorage();
    }
}
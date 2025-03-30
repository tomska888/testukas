<template>
  <div class="day-navigation">
    <button class="nav-arrow left" @click="previousWeek">&lt;</button>
    <div class="days-container">
      <button
        v-for="day in displayedDays"
        :key="day"
        :class="['day-button', { selected: day === selectedDate, today: day === today }]"
        :data-date="day"
        @click="navigateToDate(day)"
      >
        <span class="day-number">{{ new Date(day).getDate() }}</span>
        <span class="day-name">{{ formatDateShort(day) }}</span>
      </button>
    </div>
    <button class="nav-arrow right" @click="nextWeek">&gt;</button>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits, nextTick, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps(["selectedDate"]);
const emit = defineEmits(["update-error"]);
const router = useRouter();
const route = useRoute();

const today = new Date().toISOString().slice(0, 10);
const selectedDate = ref(props.selectedDate || today);
const currentOffset = ref(0);

const navigateToDate = (date) => {
  if (date > today) {
    emit("update-error", true);

    selectedDate.value = date;
    scrollToSelectedDate();

    setTimeout(() => {
      emit("update-error", false);
      router.push(`/day/${today}`);
      selectedDate.value = today;
      scrollToSelectedDate();
    }, 2000);
  } else {
    emit("update-error", false);
    router.push(`/day/${date}`);
    selectedDate.value = date;
    scrollToSelectedDate();
  }
};

const displayedDays = computed(() => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + currentOffset.value);

  const days = [];
  for (let i = -3; i <= 3; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
});

const previousWeek = () => {
  currentOffset.value -= 7;
};

const nextWeek = () => {
  if (new Date(displayedDays.value[displayedDays.value.length - 1]) < new Date(today)) {
    currentOffset.value += 7;
  }
};

const scrollToSelectedDate = () => {
  nextTick(() => {
    const selectedButton = document.querySelector(`.day-button[data-date='${selectedDate.value}']`);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
};

watch(
  () => route.params.date,
  (newDate) => {
    if (newDate > today) {
      emit("update-error", true);
      router.push(`/day/${today}`);
      selectedDate.value = today;
    } else {
      emit("update-error", false);
      selectedDate.value = newDate;
    }
    scrollToSelectedDate();
  }
);

onMounted(() => {
  scrollToSelectedDate();
});

const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};
</script>

<style scoped>
</style>
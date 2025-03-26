<template>
  <div class="day-navigation">
    <div class="days-container">
      <button
        v-for="day in past7Days"
        :key="day"
        :class="['day-button', { selected: day === selectedDate, today: day === today }]"
        :data-date="day"
        @click="navigateToDate(day)"
      >
        <span class="day-number">{{ new Date(day).getDate() }}</span>
        <span class="day-name">{{ formatDateShort(day) }}</span>
      </button>
    </div>
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

const past7Days = computed(() => {
  const todayDate = new Date();
  const days = [];
  for (let i = -3; i <= 3; i++) {
    const date = new Date(todayDate);
    date.setDate(todayDate.getDate() + i);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
});

const scrollToSelectedDate = () => {
  nextTick(() => {
    const selectedButton = document.querySelector(`.day-button[data-date='${selectedDate.value}']`);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: "instant", inline: "center", block: "nearest" });
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
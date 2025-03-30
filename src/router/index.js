import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AddHabitView from '../views/AddHabitView.vue';
import Onboarding from '../components/Onboarding.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/day/:date', name: 'day', component: HomeView },
    { path: '/add-habit', name: 'add-habit', component: AddHabitView },
    { path: '/onboarding', name: 'onboarding', component: Onboarding },
    { path: '/:catchAll(.*)', redirect: '/' }
  ],
});

const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
};

router.beforeEach((to, from, next) => {
  const today = new Date().toISOString().slice(0, 10);

  if (!localStorage.getItem('onboardingComplete') && to.name !== 'onboarding') {
    return next({ name: 'onboarding' });
  }

  if (to.name === 'day') {
    const { date } = to.params;

    if (!isValidDate(date)) {
      return next({ name: 'day', params: { date: today } });
    }
  }

  next();
});

export default router;
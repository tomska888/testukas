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
    { path: '/onboarding', name: 'onboarding', component: Onboarding }
  ],
});

router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('onboardingComplete') && to.name !== 'onboarding') {
    next({ name: 'onboarding' });
  } else {
    next();
  }
});

export default router;
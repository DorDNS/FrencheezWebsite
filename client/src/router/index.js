import { createRouter, createWebHistory } from 'vue-router';
import HallOfFame from '@/views/HallOfFame.vue';

const routes = [
  {
    path: '/hall-of-fame',
    name: 'HallOfFame',
    component: HallOfFame,
  },
  // Add more routes here as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
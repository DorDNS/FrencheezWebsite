import { createRouter, createWebHistory } from 'vue-router';
import HallOfFame from '@/views/HallOfFame.vue';

const routes = [
  {
    path: '/hall-of-fame',
    name: 'HallOfFame',
    component: HallOfFame,
  },
  {
    path: '/cheese/:id',
    name: 'CheeseInfo',
    component: () => import('@/views/CheeseInfoPage.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
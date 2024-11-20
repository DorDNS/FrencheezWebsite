import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import HallOfFame from '@/views/HallOfFame.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import MyProgress from '@/views/MyProgress.vue';
import Quiz from '@/views/QuizPage.vue';
import CheeseInfoPage from '@/views/CheeseInfoPage.vue';

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginPage 
  },
  { path: '/register', 
    name: 'Register', 
    component: RegisterPage 
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }, // Restrict access
  },
  {
    path: '/hall-of-fame',
    name: 'HallOfFame',
    component: HallOfFame,
    meta: { requiresAuth: true }, // Restrict access
  },
  {
    path: '/cheese/:id',
    name: 'CheeseInfo',
    component: CheeseInfoPage,
    meta: { requiresAuth: true }, // Restrict access
  },
  {
    path: '/progress',
    name: 'MyProgress',
    component: MyProgress,
    meta: { requiresAuth: true }, // Restrict access
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz,
    meta: { requiresAuth: true }, // Restrict access
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Function to validate the token
function isTokenValid() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const isExpired = Date.now() >= payload.exp * 1000; // Compare expiration time
    return !isExpired;
  } catch (error) {
    return false;
  }
}

// Global navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isTokenValid()) {
    next('/login'); // Redirect to login if token is invalid or missing
  } else {
    next(); // Allow navigation
  }
});

export default router;

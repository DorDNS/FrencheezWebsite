import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import HallOfFame from '@/views/HallOfFame.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import MyProgress from '@/views/MyProgress.vue';
import Quiz from '@/views/QuizPage.vue';
import CheeseInfoPage from '@/views/CheeseInfoPage.vue';
import AdminPage from '@/views/AdminPage.vue';
import UserManagement from '@/views/UserManagement.vue';

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
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }, // Restrict access to admins
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true }, // Restrict access to admins
  },
  {
    path: '/cheese/:id',
    name: 'CheeseInfo',
    component: CheeseInfoPage,
    meta: { requiresAuth: true }, // Restrict access
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz,
    meta: { requiresAuth: true }, // Restrict access
  },
  {
    path: '/progress',
    name: 'MyProgress',
    component: MyProgress,
    meta: { requiresAuth: true }, // Restrict access
  },
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
  const isAuthenticated = isTokenValid();
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin') || 'false');

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router;
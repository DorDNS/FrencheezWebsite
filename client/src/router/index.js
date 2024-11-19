import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import HallOfFame from '@/views/HallOfFame.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import MyProgress from '@/views/MyProgress.vue'; // Importer la vue MyProgress

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage, // Set the Home page as the default route
    },
    {
        path: '/hall-of-fame',
        name: 'HallOfFame',
        component: HallOfFame,
        meta: { requiresAuth: true }, // Protect this route
    },
    {
        path: '/cheese/:id',
        name: 'CheeseInfo',
        component: () => import('@/views/CheeseInfoPage.vue'),
        meta: { requiresAuth: true }, // Protect this route
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
    },
    {
        path: '/progress',
        name: 'MyProgress',
        component: MyProgress,
        meta: { requiresAuth: true }, // Protect this route
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard to check for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'Register') {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Allow access if authenticated or if the route is login or register
  }
});

export default router;
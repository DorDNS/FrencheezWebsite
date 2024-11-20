import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

const app = createApp(App);

axios.defaults.baseURL = 'http://localhost:3000/api';

// Attach token to all requests if it exists
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Validate token on app load
function validateTokenOnAppLoad() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      if (Date.now() >= payload.exp * 1000) {
        throw new Error('Token expired');
      }
    } catch (error) {
      localStorage.removeItem('token'); // Remove invalid token
      router.push('/login'); // Redirect to login
    }
  }
}

validateTokenOnAppLoad();

app.use(router).mount('#app');

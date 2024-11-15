import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');

import axios from 'axios';

// Set the base URL for all requests
axios.defaults.baseURL = 'http://localhost:3000/api';

// Attach token to all requests if it exists
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

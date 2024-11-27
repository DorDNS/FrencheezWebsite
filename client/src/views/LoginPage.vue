<template>
  <div class="auth-page">
    <h1 class="auth-title">Bienvenue!</h1>
    <div class="auth-subtitle">LOG IN TO YOUR ACCOUNT</div>
    <form @submit.prevent="login">
      <div class="input-group">
        <label>Username</label>
        <input v-model="username" type="text" required />
      </div>
      <div class="input-group">
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      <button class="login-btn" type="submit">Log In</button>
      <router-link class="switch-btn" to="/register">Create a New Account</router-link>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          username: this.username,
          password: this.password,
        });
        localStorage.setItem('token', response.data.token);

        // Fetch user details to get admin status
        const userResponse = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${response.data.token}` },
        });
        localStorage.setItem('isAdmin', userResponse.data.admin);

        this.$router.push('/hall-of-fame');
      } catch (error) {
        console.error("Login failed:", error);
        alert("Invalid username or password. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  background-color: #faf9f6;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.auth-title {
  font-size: 3rem;
  color: #575dce;
  font-family: 'Rubik', sans-serif;
  margin-bottom: 10px;
}

.auth-subtitle {
  background-color: #f9e1b9;
  padding: 8px 20px;
  font-size: 1.1rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 30px;
  font-family: 'Rubik', sans-serif; /* Ensures font is Rubik */
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 1rem;
  font-family: 'Rubik', sans-serif;
  color: #333;
  margin-bottom: 5px;
  text-align: left;
}

.input-group input {
  width: 90%; /* Adjusted width to prevent overflow */
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 20px;
  background-color: #e1e0e0;
}

.login-btn {
  background-color: #c6ffc1;
  color: #333;
  font-size: 1.2rem;
  padding: 12px;
  width: 90%; /* Reduced width to avoid overflow */
  border: none;
  border-radius: 20px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #a4d6a1;
}

.switch-btn {
  display: inline-block;
  background-color: #d5c1ff;
  color: #333;
  font-size: 1.2rem;
  padding: 12px;
  width: 336px;
  border: none;
  border-radius: 20px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.switch-btn:hover {
  background-color: #b7a6e1;
}
</style>
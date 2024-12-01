<template>
    <div class="auth-page">
      <h1 class="auth-title">Bienvenue!</h1>
      <div class="auth-subtitle">REGISTER A NEW ACCOUNT</div>
      <form @submit.prevent="register">
        <div class="input-group">
          <label>Full Name</label>
          <input v-model="fullName" type="text" required />
        </div>
        <div class="input-group">
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>
        <div class="input-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <div class="input-group">
          <label>Confirm Password</label>
          <input v-model="confirmPassword" type="password" required />
        </div>
        <button class="register-btn" type="submit">Register</button>
        <router-link class="switch-btn" to="/login">Already have an Account?</router-link>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        try {
          const response = await axios.post('http://localhost:3000/api/auth/register', {
            full_name: this.fullName,
            username: this.username,
            password: this.password,
          });
          
          // Save the token in local storage for automatic login
          localStorage.setItem('token', response.data.token);
          
          // Redirect to the Hall of Fame page
          this.$router.push('/hall-of-fame');
        } catch (error) {
          console.error("Registration failed:", error);
          alert("There was an error creating your account. Please try again.");
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
    font-family: 'Rubik', sans-serif;
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
  
  .register-btn {
    background-color: #c6ffc1;
    color: #333;
    font-size: 1.2rem;
    padding: 12px;
    width: 90%; /* Ensures button fits within the container */
    border: none;
    border-radius: 20px;
    font-family: 'Rubik', sans-serif;
    font-weight: bold;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
  }
  
  .register-btn:hover {
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
  
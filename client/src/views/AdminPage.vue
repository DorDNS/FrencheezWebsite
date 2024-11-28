<template>
    <div class="admin-page">
      <h1>Admin Panel</h1>
      <div class="admin-cards">
        <div
          v-for="(card, index) in adminCards"
          :key="index"
          class="admin-card"
          @click="navigateTo(card.route)"
        >
          <img :src="card.icon" alt="Card Icon" />
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
        <div class="admin-card" @click="$router.push({ name: 'CheesesList' })">
          <img src="/images/cheese-icon.png" alt="Cheese Icon" />
          <h3>Manage Cheeses</h3>
          <p>Manage the list of cheeses.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AdminPage",
    data() {
      return {
        adminCards: [
          {
            title: "User Management",
            description: "Manage users and their permissions.",
            route: "/user-management",
            icon: "/images/user-management-icon.png",
          },
        ],
      };
    },
    methods: {
      navigateTo(route) {
        this.$router.push(route);
      },
    },
  };
  </script>
  
  <style scoped>
  .admin-page {
    max-width: 900px;
    margin: 20px auto;
    padding: 20px;
    font-family: "Rubik", sans-serif;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }
  
  .admin-cards {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .admin-card {
    flex: 1;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  .admin-card:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
  }
  
  .admin-card img {
    max-width: 50px;
    margin-bottom: 10px;
  }
  </style>
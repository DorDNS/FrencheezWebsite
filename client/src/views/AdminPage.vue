<template>
  <div class="admin-page">
    <div class="white-background">
      <h1>Admin Panel</h1>
      <div class="admin-cards">
        <div
          v-for="(card, index) in adminCards"
          :key="index"
          class="admin-card"
          @click="navigateTo(card.route)"
        >
          <img :src="card.icon" :alt="card.title + ' Icon'" />
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
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
        {
          title: "Manage Cheeses",
          description: "Manage the list of cheeses.",
          route: { name: "CheesesList" },
          icon: "/images/cheese-icon.png",
        },
        {
          title: "Manage Quizzes",
          description: "Add, edit, or delete quiz questions.",
          route: { name: "EditQuizzes" },
          icon: "/images/quiz-icon.png",
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
  font-family: "Rubik", sans-serif;
}

.white-background {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.admin-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.admin-card {
  flex: 1;
  max-width: 200px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.admin-card:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.admin-card img {
  max-width: 50px;
  margin-bottom: 10px;
}

.admin-card h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: black;
}

.admin-card p {
  font-size: 14px;
  color: #666;
}

/* Media query for small screens */
@media (max-width: 768px) {
  .admin-cards {
    flex-direction: column;
  }

  .admin-card {
    max-width: 100%;
  }
}
</style>

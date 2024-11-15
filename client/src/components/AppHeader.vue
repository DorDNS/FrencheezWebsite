<template>
  <header class="header">
    <div class="logo">Frencheez</div>
    <nav class="navigation">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/hall-of-fame" class="nav-link">Hall of Fame</router-link>
      <router-link to="/quiz" class="nav-link">Quiz</router-link>
    </nav>
    <router-link to="/progress" class="progress-button">
      <img src="@/assets/my_progress_icon.png" alt="My Progress Icon" />
      My Progress
    </router-link>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.header {
  background-color: #e09864;
  height: 90px;
  padding: 0 40px; /* Adds more space on left and right */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: 'Leckerli One', cursive;
  font-size: 48px; /* Slightly smaller */
  color: #2c2c27;
  margin: 0;
  padding-right: 20px; /* Adds space between logo and navigation */
}

.navigation {
  display: flex;
  gap: 20px; /* Adds space between navigation links */
}

.nav-link {
  font-family: 'Rubik', sans-serif;
  font-size: 28px; /* Slightly smaller */
  font-weight: 500;
  color: #382877;
  text-decoration: none;
}

.progress-button {
  background-color: #fae5ac;
  color: black;
  display: flex;
  align-items: center;
  padding: 8px 16px; /* Adjusted padding for smaller button */
  border-radius: 40px;
  font-family: 'Rubik', sans-serif;
  font-size: 28px; /* Slightly smaller */
  font-weight: 500;
  text-decoration: none;
}

.progress-button img {
  width: 30px; /* Smaller icon size */
  height: 30px;
  margin-right: 10px;
}
</style>
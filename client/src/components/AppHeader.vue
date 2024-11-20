<template>
  <header class="header">
    <div class="header-content">
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
    </div>
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
  padding: 10px 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px; /* Center content within a max-width container */
  margin: 0 auto; /* Center the header content */
  width: 100%;
}

.logo {
  font-family: 'Leckerli One', cursive;
  font-size: 48px;
  color: #2c2c27;
}

.navigation {
  display: flex;
  gap: 30px;
  min-width: 350px; /* Ensures enough space for navigation links */
}

.nav-link {
  font-family: 'Rubik', sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: #382877;
  text-decoration: none;
  white-space: nowrap; /* Prevents any of the nav items from wrapping */
}

.progress-button {
  background-color: #fae5ac;
  color: black;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 40px;
  font-family: 'Rubik', sans-serif;
  font-size: 28px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap; /* Prevents the text from wrapping to two lines */
}

.progress-button img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

/* Media query for mobile view */
@media (max-width: 900px) { /* Adjusted breakpoint to prevent wrapping issue */
  .header-content {
    flex-direction: column;
    align-items: center; /* Center-aligns elements in mobile view */
  }

  .navigation {
    flex-direction: row;
    gap: 30px;
    margin: 10px 0;
    justify-content: center; /* Center-aligns the navigation links */
  }

  .progress-button {
    margin-top: 10px;
    padding: 8px 16px;
  }
}
</style>

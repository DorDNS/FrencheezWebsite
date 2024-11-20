<template>
  <div class="my-progress">
    <div class="favorites-section">
      <h2>My Favorite Cheeses</h2>
      <div class="favorites-list">
        <div
          v-for="cheese in favoriteCheeses"
          :key="cheese.cheese_id"
          class="favorite-cheese-item"
          @click="goToCheeseInfo(cheese.cheese_id)"
        >
          <img :src="`http://localhost:3000${cheese.image_path}`" alt="Cheese Image" />
          <span>{{ cheese.name }}</span>
        </div>
      </div>
    </div>
    <button @click="logout" class="logout-button">Log Out</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyProgress",
  data() {
    return {
      favoriteCheeses: [], // Store favorite cheeses
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    async fetchFavorites() {
      try {
        const response = await axios.get("/favorites");
        console.log(response.data); // Vérifiez les données dans la console
        this.favoriteCheeses = response.data; // Expecting cheese_id, name, and image_path
      } catch (error) {
        console.error("Error fetching favorite cheeses:", error);
      }
    },
    goToCheeseInfo(cheeseId) {
      this.$router.push({ name: "CheeseInfo", params: { id: cheeseId } });
    },
  },
  created() {
    this.fetchFavorites(); // Fetch favorite cheeses on load
  },
};
</script>

<style scoped>
.my-progress {
  max-width: 700px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background-color: #FFFFFF;
  font-family: "Rubik", sans-serif;
}

.logout-button {
  display: block;
  margin: 10px auto;
  width: 300px;
  height: 50px;
  font-size: 1.5rem;
  color: #D92929;
  background-color: #FFC1C1;
  border: none;
  border-radius: 40px;
  font-family: "Rubik", sans-serif;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.logout-button:hover {
  background-color: #FF9999;
  transform: scale(1.02);
}

.logout-button:active {
  background-color: #FF7F7F;
  transform: scale(0.98);
}

.favorites-section {
  margin-top: 20px;
}

.favorites-section h2 {
  font-size: 1.8rem;
  font-family: "Rubik", sans-serif;
  color: #575dce;
  text-align: center;
  margin-bottom: 15px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 200px; /* Limit height for scrolling */
  overflow-y: auto; /* Enable vertical scroll */
}

.favorite-cheese-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f3f3f3;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.favorite-cheese-item:hover {
  background-color: #e6e6e6;
  transform: scale(1.02);
}

.favorite-cheese-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.favorite-cheese-item span {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  font-family: "Rubik", sans-serif;
}
</style>

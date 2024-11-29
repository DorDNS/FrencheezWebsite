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
    <button v-if="isAdmin" @click="goToAdminPage" class="manage-button">Manage Website</button>
    <button @click="goToEditProfile" class="edit-profile-button">Edit Profile</button>
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
      isAdmin: false, // Store admin status
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    async fetchFavorites() {
      try {
        // Fetch favorite cheeses
        const response = await axios.get("/favorites");
        console.log(response.data); // Debugging step
        this.favoriteCheeses = response.data; // Expecting cheese_id, name, and image_path

        // Fetch user data to check if they are admin
        const userResponse = await axios.get("/user");
        this.isAdmin = parseInt(userResponse.data.admin, 10) === 1; // Convert admin to integer and compare
        console.log(userResponse.data)
      } catch (error) {
        console.error("Error fetching favorite cheeses or user data:", error);
      }
    },
    goToCheeseInfo(cheeseId) {
      this.$router.push({ name: "CheeseInfo", params: { id: cheeseId } });
    },
    goToAdminPage() {
      this.$router.push("/admin");
    },
    goToEditProfile() {
      this.$router.push("/edit-profile");
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

.manage-button {
  display: block;
  margin: 10px auto;
  width: 300px;
  height: 50px;
  font-size: 1.5rem;
  color: #DAA520; /* Dark yellow text for contrast */
  background-color: #FFFACD; /* Lighter yellow background */
  border: none;
  border-radius: 40px;
  font-family: "Rubik", sans-serif;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.manage-button:hover {
  background-color: #FFECB3; /* Slightly darker shade of light yellow on hover */
  transform: scale(1.02);
}

.manage-button:active {
  background-color: #FFE4B5; /* A deeper light yellow for active state */
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

.edit-profile-button {
  display: block;
  margin: 10px auto;
  width: 300px;
  height: 50px;
  font-size: 1.5rem;
  color: #0056b3; /* Stronger blue text */
  background-color: #cce5ff; /* Light blue background */
  border: none;
  border-radius: 40px;
  font-family: "Rubik", sans-serif;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.edit-profile-button:hover {
  background-color: #b3d7ff; /* Slightly darker shade of light blue on hover */
  transform: scale(1.02);
}

.edit-profile-button:active {
  background-color: #99c9ff; /* Even darker shade of light blue on active */
  transform: scale(0.98);
}
</style>

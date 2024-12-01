<template>
  <div class="title-container">
    <h1>My Progress</h1>
  </div>
  
  <div class="my-progress">
    <div class="profile-section">
      <div class="user-info">
        <p><strong>{{ userName }}</strong></p>
      </div>
    </div>
    <div class="level-section">
      <div class="level-left">
        <span class="level-label">LEVEL</span>
        <span class="level-value">{{ userLevel }}</span>
      </div>
      <div class="level-right">
        <span class="level-cheese">{{ cheeseForLevel }}</span>
      </div>
    </div>


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

    <div class="knowledge-section">
      <h2>My Knowledge</h2>
      <div class="badge-list">
        <div
          v-for="quiz in quizzes"
          :key="quiz.id"
          class="badge-item"
          :class="{ unlocked: userScores[quiz.id] === quiz.maxScore }"
        >
          <img :src="quiz.icon" :alt="`${quiz.name} Badge`" />
          <span>{{ quiz.name }}</span>
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
      favoriteCheeses: [],
      userScores: {},
      quizzes: [
        { id: "basic-knowledge", name: "Basic Knowledge", icon: "/images/badge-basic.png", maxScore: 10 },
        { id: "tasting-cheese", name: "Tasting Cheese", icon: "/images/badge-tasting.png", maxScore: 10 },
        { id: "pairing-cheese", name: "Pairing Cheese", icon: "/images/badge-pairing.png", maxScore: 10 },
      ],
      isAdmin: false,
      userLevel: 1,
      userName: "",
    };
  },
  computed: {
    cheeseForLevel() {
      const cheeseNames = ["EMMENTAL", "COMTÉ", "CAMEMBERT", "BLEU"];
      return cheeseNames[this.userLevel - 1] || "Emmental";
    },
  },
  methods: {
    async logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    async fetchFavorites() {
      try {
        const response = await axios.get("/favorites");
        this.favoriteCheeses = response.data;

        const userResponse = await axios.get("/user");
        this.isAdmin = parseInt(userResponse.data.admin, 10) === 1;
        this.userName = userResponse.data.full_name || userResponse.data.username;
      } catch (error) {
        console.error("Error fetching favorite cheeses or user data:", error);
      }
    },
    async fetchScores() {
      try {
        const quizDetails = await Promise.all(
          this.quizzes.map((quiz) =>
            axios.get(`/quiz/${quiz.id}`).then((response) => {
              quiz.maxScore = response.data.quizz.length;
              return quiz;
            })
          )
        );

        await Promise.all(
          quizDetails.map((quiz) =>
            axios.get(`/quiz/${quiz.id}/best-score`).then((response) => {
              this.userScores[quiz.id] = response.data.best_score || 0;
            })
          )
        );

        const unlockedBadges = quizDetails.filter((quiz) => this.userScores[quiz.id] >= quiz.maxScore).length;
        this.userLevel = Math.min(unlockedBadges + 1, 4);
      } catch (error) {
        console.error("Error fetching quiz scores or details:", error);
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
  async created() {
    await this.fetchFavorites();
    await this.fetchScores();
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
  color: #DAA520;
  background-color: #FFFACD;
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
  background-color: #FFECB3;
  transform: scale(1.02);
}

.knowledge-section,
.favorites-section {
  margin-top: 20px;
}

.knowledge-section h2,
.favorites-section h2 {
  font-size: 1.8rem;
  font-family: "Rubik", sans-serif;
  color: #575dce;
  text-align: left;
  margin-bottom: 15px;
}

.badge-list {
  display: flex;
  justify-content: center;
  gap: 30px; /* Espacement entre les badges */
  margin-top: 20px; /* Espacement supérieur */
  margin-bottom: 40px;
}

.badge-item {
  text-align: center; /* Centre le texte sous l'icône */
}

.badge-item img {
  width: 80px; /* Augmente la largeur de l'image */
  height: 80px; /* Augmente la hauteur de l'image */
  opacity: 0.5; /* Icône grisée par défaut */
  transition: opacity 0.3s ease;
}

.badge-item.unlocked img {
  opacity: 1; /* Icône entièrement visible si débloquée */
}

.badge-item span {
  display: block; /* Le titre passe sur une nouvelle ligne */
  margin-top: 10px; /* Espacement entre l'icône et le texte */
  font-size: 1.2rem; /* Taille du texte */
  font-weight: bold; /* Texte en gras */
  color: #333; /* Couleur du texte */
  font-family: "Rubik", sans-serif;
}

.edit-profile-button {
  display: block;
  margin: 10px auto;
  width: 300px;
  height: 50px;
  font-size: 1.5rem;
  color: #0056b3;
  background-color: #cce5ff;
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
  background-color: #b3d7ff;
  transform: scale(1.02);
}

.edit-profile-button:active {
  background-color: #99c9ff;
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


.title-container {
display: flex;
align-items: center;
position: relative;
margin-bottom: 20px;
width: 100%;
}

.title-container h1 {
font-family: 'Rubik', sans-serif;
font-weight: 500;
font-size: 3rem;
color: #575dce;
background-color: #f5f3e7;
padding: 0 15px; 
margin-left: 10%; 
z-index: 1;
}

.title-container::before {
content: '';
position: absolute;
top: 50%;
left: 0;
right: 0;
height: 1px; 
background-color: black; 
z-index: 0;
}
.title-container {
display: flex;
align-items: center;
position: relative;
margin-bottom: 20px;
width: 100%;
}

.title-container h1 {
font-family: 'Rubik', sans-serif;
font-weight: 500;
font-size: 3rem;
color: #575dce; /* Violet correspondant au style */
background-color: #f5f3e7; /* Fond clair */
padding: 0 15px;
margin-left: 10%;
z-index: 1;
}

.title-container::before {
content: '';
position: absolute;
top: 50%;
left: 0;
right: 0;
height: 1px;
background-color: black;
z-index: 0;
}

.level-section {
  display: flex;
  justify-content: space-between; /* Aligne les éléments aux extrémités */
  align-items: center;
  margin: 20px 0;
  background-color: #f8e5c1;
  border-radius: 0px;
  padding: 10px 20px;
  font-family: "Rubik", sans-serif;
}

.level-left {
  display: flex;
  align-items: center;
}

.level-label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.level-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0056b3;
  background-color: #cce5ff;
  border-radius: 50%;
  padding: 5px 15px;
  margin-left: 10px;
}

.level-right {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  text-align: right;
}


</style>

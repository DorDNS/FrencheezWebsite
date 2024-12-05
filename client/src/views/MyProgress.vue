<template>
  <div class="progress-page">
  <div class="title-container">
    <h1>My Progress</h1>
  </div>
  <div class="my-progress">
    <div class="profile-section">
      <div class="circular-progress">
        <svg viewBox="0 0 36 36" class="circular-chart green">
          <path class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path class="circle"
                :stroke-dasharray="`${progress}, 100`"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
      </div>
      <div class="user-details">
        <h2 class="full-name">{{ userName }}</h2>
        <p class="username">@{{ username }}</p>
        <p class="description">{{ description }}</p>
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
      username: "",
      description: "",
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
    async fetchUserProgress() {
      try {
        const response = await axios.get("/user/progress", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.userName = response.data.full_name || "Unknown User";
        this.username = response.data.username || "unknown";
        this.description = response.data.description || "No description provided";
        this.progressPercentage = response.data.progress_percentage || 0;

        // Update progress bar
        this.updateProgressCircle();
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    },

    updateProgressCircle() {
      this.$nextTick(() => { // Ensure the DOM is updated
      const circle = document.querySelector(".circle");
      if (!circle) {
        console.error("Circle element not found!");
        return;
      }

      const radius = 15.9155; // Based on the SVG's path dimensions
      const circumference = 2 * Math.PI * radius;

      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      const offset = circumference - (this.progressPercentage / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    });
    },

    calculateDasharray() {
    const radius = 15.9155; // Based on SVG dimensions
    const circumference = 2 * Math.PI * radius;

    // Calculate progress offset
    const progressOffset = (this.progressPercentage / 100) * circumference;

    // Ensure a visible dot at 0%
    const minOffset = 2; // Small visible dot size
    return `${Math.max(progressOffset, minOffset)}, ${circumference}`;
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
    await this.fetchUserProgress();
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
  text-align: left;
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

.profile-section {
  display: flex;
  align-items: center; /* Vertically align progress chart and user details */
  justify-content: center; /* Center the group horizontally */
  gap: 20px; /* Space between the progress chart and user details */
  height: auto; /* Remove the extra height */
  padding: 20px 0; /* Add minimal padding for spacing above and below */
}

.circular-progress {
  width: 200px; /* Adjust the size of the progress bar */
  height: 200px;
  position: relative;
}

.circular-chart {
  max-width: 100%;
  max-height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 3.8;
  stroke: #4caf50;
  stroke-linecap: round;
  transition: stroke-dasharray 0.35s ease;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  max-width: 300px; 
}

.full-name {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: #000;
}

.username {
  margin: 0;
  font-size: 1.2rem;
  color: #666;
  font-style: italic;
}

.description {
  margin-top: 10px;
  font-size: 1rem;
  color: #333;
  font-family: "Rubik", sans-serif;
  font-style: italic;
}

.progress-page {
    max-width: 100%;
    margin: auto;
    padding: 20px;
  }

</style>

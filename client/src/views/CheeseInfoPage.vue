<template>
  <div class="cheese-info-card">
    <button @click="goBack" class="back-to-hall-of-fame">
      Back to Hall of Fame
    </button>
    <img :src="`http://localhost:3000${cheese.image_path}`" class="cheese-image" :alt="cheese.name" />
    <h1 class="cheese-name">{{ cheese.name }}</h1>

    <div class="info-section">
      <div class="section-title" style="background-color: #FABE66">ID Card</div>
      <div class="section-content" style="background-color: #FFF3DE">
        <ul>
          <li><strong>Region:</strong> {{ cheese.region }}</li>
          <li><strong>Type:</strong> {{ cheese.type }}</li>
          <li><strong>Milk Type:</strong> {{ cheese.milk_type }}</li>
          <li><strong>Aging Period:</strong> {{ cheese.aging_period }}</li>
        </ul>
      </div>
    </div>

    <div class="info-section">
      <div class="section-title" style="background-color: #94C4FF">Tasting</div>
      <div class="section-content" style="background-color: #E3EEFF">
        <ul>
          <li><strong>Flavor Profile:</strong> {{ cheese.flavor_profile }}</li>
          <li><strong>Texture:</strong> {{ cheese.texture }}</li>
          <li><strong>Serving Temperature:</strong> {{ cheese.serving_temperature }}</li>
        </ul>
      </div>
    </div>

    <div class="info-section">
      <div class="section-title" style="background-color: #FF9299">Pairing</div>
      <div class="section-content" style="background-color: #FFE3EA">
        <ul>
          <li><strong>Wine:</strong> {{ cheese.wine_pairing }}</li>
          <li><strong>Bread:</strong> {{ cheese.bread_pairing }}</li>
          <li><strong>Fruit:</strong> {{ cheese.fruit_pairing }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cheese: {}
    };
  },
  created() {
    const cheeseId = this.$route.params.id;
    axios.get(`http://localhost:3000/api/cheeses/${cheeseId}`)
      .then(response => {
        this.cheese = response.data;
      })
      .catch(error => {
        console.error("There was an error fetching the cheese data:", error);
      });
  },
  methods: {
    goBack() {
      this.$router.push('/hall-of-fame');
    }
  }
};
</script>

<style scoped>
.cheese-info-card {
max-width: 700px;
margin: 20px auto;
padding: 20px;
border: 1px solid #E0E0E0;
border-radius: 8px;
background-color: #FFFFFF; 
font-family: 'Rubik', sans-serif;
}

.cheese-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: block;
  margin: 0 auto 20px;
  object-fit: cover; 
  object-position: center; 
}

.cheese-name {
font-size: 2rem;
text-align: center;
color: #333;
margin-bottom: 20px;
}

.info-section {
margin-bottom: 20px;
}

.section-title {
display: inline-block;
padding: 5px 10px;
font-weight: bold;
font-size: 1.2rem;
color: #333;
margin-bottom: 5px;
border-radius: 4px;
}

.section-content {
padding: 15px;
border: 1px solid #E0E0E0;
border-radius: 0; 
}

.section-content ul {
list-style-type: disc;
margin: 0;
padding-left: 20px;
}

.section-content li {
font-size: 1rem;
color: #333;
margin-bottom: 8px; 
}

.back-to-hall-of-fame {
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #5f4b8b;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-to-hall-of-fame:hover {
  background-color: #4a3b6d;
  transform: scale(1.05);
}

/* Add media query for mobile view */
@media (max-width: 768px) {
.cheese-info-card {
  margin: 20px 15px;
}
}
</style>

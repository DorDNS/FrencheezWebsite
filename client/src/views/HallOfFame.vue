<template>
  <div class="hall-of-fame">
    <div class="title-container">
      <h1>À la carte</h1>
    </div>
    <div class="search-container">
      <input type="text" placeholder="Search..." v-model="searchQuery" />
      <img src="@/assets/filter-icon.png" alt="Filter Icon" class="filter-icon" />
    </div>
    <div class="cheese-grid">
      <!-- Wrap each cheese card in a router-link -->
      <router-link
        v-for="cheese in filteredCheeses"
        :key="cheese.id"
        :to="{ name: 'CheeseInfo', params: { id: cheese.id } }"
        class="cheese-card"
      >
        <img :src="`http://localhost:3000${cheese.image_path}`" class="cheese-image" :alt="cheese.name" />
        <span class="cheese-name">{{ cheese.name }}</span>
        <span class="favorite-icon">★</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cheeses: [],
      searchQuery: '',
    };
  },
  computed: {
    filteredCheeses() {
      return this.cheeses.filter(cheese =>
        cheese.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  created() {
    axios.get('http://localhost:3000/api/cheeses')
      .then(response => {
        this.cheeses = response.data;
      })
      .catch(error => {
        console.error("There was an error fetching the cheeses:", error);
      });
  }
};
</script>
  
  <style scoped>
  .hall-of-fame {
    padding: 20px;
    text-align: center;
  }
  
  h1 {
    font-size: 3rem;
    color: #575dce;
    margin-bottom: 20px;
  }
  
  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-container input {
    width: 60%;
    padding: 10px;
    border: none;
    border-radius: 20px;
    background-color: #e1e0e0;
    font-size: 1.2rem;
  }
  
  .filter-icon {
    width: 24px;
    height: 24px;
    margin-left: 10px;
  }
  
  .cheese-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .cheese-card {
  position: relative;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cheese-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.cheese-grid .cheese-card .cheese-name {
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Rubik', sans-serif;
  color: black; /* Ensure the text color is black */
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Adds "..." if the name is too long */
  display: block;
  margin-top: 10px;
  text-decoration: none !important; /* Remove underline */
}

.cheese-grid .cheese-card {
  text-decoration: none; /* Ensure the whole link has no underline */
}



.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #d9d9d9;
  cursor: pointer;
}

.favorite-icon:hover {
  color: #ffdd57;
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
  padding: 0 15px; /* Adjust space around title text */
  margin-left: 10%; /* Shift the title slightly to the left */
  z-index: 1;
}

.title-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px; /* Reduce the line thickness */
  background-color: black; /* Change line color to black */
  z-index: 0;
}


</style>
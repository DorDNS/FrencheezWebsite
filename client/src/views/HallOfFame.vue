<template>
  <div class="hall-of-fame" @click="closeFilterModal">
    <div class="title-container">
      <h1>Hall Of Fame</h1>
    </div>
    <div class="search-container">
      <input type="text" placeholder="Search..." v-model="searchQuery" />
      <img src="@/assets/filter-icon.png" alt="Filter Icon" class="filter-icon" @click.stop="toggleFilterModal" />
    </div>
      
    <!-- Filter Modal -->
    <div v-if="showFilterModal" class="filter-modal" @click.stop>
      <h2>Filter Options</h2>
      <label>
        Alphabetical Order
        <select v-model="filters.alphabetical">
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </label>
      <label>
        Region
        <select v-model="filters.region">
          <option value="">All</option>
          <option v-for="region in uniqueRegions" :key="region" :value="region">{{ region }}</option>
        </select>
      </label>
      <label>
        Type
        <select v-model="filters.type">
          <option value="">All</option>
          <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>
      <label>
        Aging Period
        <input
          type="range"
          :min="minAgingPeriod"
          :max="maxAgingPeriod"
          v-model="filters.agingPeriod"
        />
        <span>{{ filters.agingPeriod }} months</span>
      </label>
      <label>
        Flavor
        <input type="text" v-model="filters.flavor" placeholder="Flavor profile" />
      </label>
      <label>
        Texture
        <input type="text" v-model="filters.texture" placeholder="Texture" />
      </label>
      <div class="button-container">
        <button @click="applyFilters">Apply Filters</button>
        <button @click="resetFilters">Reset Filters</button>
      </div>
    </div>
  
    <!-- Cheese Grid -->
    <div class="cheese-grid">
      <div
        v-for="cheese in filteredCheeses"
        :key="cheese.id"
        class="cheese-card"
        @click="goToCheeseInfo(cheese.id)"
      >
        <img :src="`http://localhost:3000${cheese.image_path}`" class="cheese-image" :alt="cheese.name" />
        <span class="cheese-name">{{ cheese.name }}</span>
        <span
          class="favorite-icon"
          :style="{ color: isFavorite(cheese.id) ? '#ffdd57' : '#d9d9d9' }"
          @click.stop="toggleFavorite(cheese.id)"
        >★</span>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      cheeses: [],
      favorites: [],
      searchQuery: '',
      showFilterModal: false,
      filters: {
        alphabetical: 'asc',
        region: '',
        type: '',
        agingPeriod: 24,
        flavor: '',
        texture: '',
      },
    };
  },
  computed: {
    uniqueRegions() {
      return [...new Set(this.cheeses.map(cheese => cheese.region))];
    },
    uniqueTypes() {
      return [...new Set(this.cheeses.map(cheese => cheese.type))];
    },
    minAgingPeriod() {
      return Math.min(...this.cheeses.map(cheese => parseInt(cheese.aging_period))) || 0;
    },
    maxAgingPeriod() {
      return Math.max(...this.cheeses.map(cheese => parseInt(cheese.aging_period))) || 24;
    },
    filteredCheeses() {
      let result = this.cheeses;
      if (this.filters.region) {
        result = result.filter(cheese => cheese.region === this.filters.region);
      }
      if (this.filters.type) {
        result = result.filter(cheese => cheese.type === this.filters.type);
      }
      if (this.filters.agingPeriod < this.maxAgingPeriod) {
        result = result.filter(cheese => parseInt(cheese.aging_period) <= this.filters.agingPeriod);
      }
      if (this.filters.flavor) {
        result = result.filter(cheese => cheese.flavor_profile.toLowerCase().includes(this.filters.flavor.toLowerCase()));
      }
      if (this.filters.texture) {
        result = result.filter(cheese => cheese.texture.toLowerCase().includes(this.filters.texture.toLowerCase()));
      }
      result = result.sort((a, b) => {
        if (this.filters.alphabetical === 'asc') return a.name.localeCompare(b.name);
        if (this.filters.alphabetical === 'desc') return b.name.localeCompare(a.name);
        return 0;
      });
      return result.filter(cheese =>
        cheese.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    toggleFilterModal() {
      this.showFilterModal = !this.showFilterModal;
    },
    closeFilterModal(event) {
      if (this.showFilterModal && !event.target.closest(".filter-modal")) {
        this.showFilterModal = false;
      }
    },
    applyFilters() {
      this.showFilterModal = false;
    },
    resetFilters() {
      this.filters = {
        alphabetical: 'asc',
        region: '',
        type: '',
        agingPeriod: this.maxAgingPeriod,
        flavor: '',
        texture: '',
      };
    },
    async fetchFavorites() {
      try {
        const response = await axios.get("/favorites");
        this.favorites = response.data.map(favorite => favorite.cheese_id);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    },
    isFavorite(cheeseId) {
      return this.favorites.includes(cheeseId);
    },
    async toggleFavorite(cheeseId) {
      try {
        if (this.isFavorite(cheeseId)) {
          await axios.delete(`/favorites/${cheeseId}`);
          this.favorites = this.favorites.filter(id => id !== cheeseId);
        } else {
          await axios.post("/favorites", { cheeseId });
          this.favorites.push(cheeseId);
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        alert("An error occurred while updating favorites.");
      }
    },
    goToCheeseInfo(cheeseId) {
      this.$router.push({ name: 'CheeseInfo', params: { id: cheeseId } });
    },
  },
  created() {
    axios
      .get("http://localhost:3000/api/cheeses")
      .then(response => {
        this.cheeses = response.data;
      })
      .catch(error => {
        console.error("There was an error fetching the cheeses:", error);
      });
    this.fetchFavorites();
  },
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
  cursor: pointer; 
  transition: transform 0.3s ease, box-shadow 0.3s ease; 
}

.cheese-card:hover {
  transform: translateY(-10px); 
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); 
}

.cheese-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.cheese-grid .cheese-card .cheese-name {
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Rubik', sans-serif;
  color: black; 
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis; 
  display: block;
  margin-top: 10px;
  text-decoration: none !important; 
}

.cheese-grid .cheese-card {
  text-decoration: none; 
}

.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #d9d9d9;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease; 
}

.favorite-icon:hover {
  color: #ffdd57;
  transform: scale(1.2); 
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

.filter-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 300px;
  border-radius: 10px;
  font-family: 'Rubik', sans-serif;
}

.filter-modal h2 {
  font-size: 1.5rem;
  color: #575dce;
  margin-bottom: 20px;
}

.filter-modal label {
  display: block;
  margin-bottom: 10px;
}

.filter-modal select,
.filter-modal input[type="range"],
.filter-modal input[type="text"] {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.button-container button {
  padding: 10px;
  background-color: #575dce;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button-container button:hover {
  background-color: #4646a8;
}
</style>
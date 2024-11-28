<template>
  <div class="cheeses-list">
    <h1>Cheeses List</h1>
    <button @click="showAddCheeseModal = true">Add New Cheese</button>
    
    <div class="cheese-item" v-for="cheese in cheeses" :key="cheese.id" @click="editCheese(cheese)">
      <img :src="`http://localhost:3000${cheese.image_path}`" alt="Cheese Image" />
      <span>{{ cheese.name }}</span>
    </div>

    <div v-if="showAddCheeseModal" class="modal">
      <h2>Add New Cheese</h2>
      <form @submit.prevent="addCheese">
        <input type="text" v-model="newCheese.name" placeholder="Name" required />
        <input type="text" v-model="newCheese.region" placeholder="Region" required />
        <input type="text" v-model="newCheese.type" placeholder="Type" required />
        <input type="text" v-model="newCheese.milk_type" placeholder="Milk Type" required />
        <input type="text" v-model="newCheese.aging_period" placeholder="Aging Period" required />
        <input type="text" v-model="newCheese.flavor_profile" placeholder="Flavor Profile" required />
        <input type="text" v-model="newCheese.texture" placeholder="Texture" required />
        <input type="text" v-model="newCheese.serving_temperature" placeholder="Serving Temperature" required />
        <input type="text" v-model="newCheese.wine_pairing" placeholder="Wine Pairing" required />
        <input type="text" v-model="newCheese.bread_pairing" placeholder="Bread Pairing" required />
        <input type="text" v-model="newCheese.fruit_pairing" placeholder="Fruit Pairing" required />
        <input type="file" @change="onFileChange" required />
        <button type="submit">Add Cheese</button>
        <button @click="showAddCheeseModal = false">Cancel</button>
      </form>
    </div>

    <div v-if="showEditCheeseModal" class="modal">
      <h2>Edit Cheese</h2>
      <form @submit.prevent="updateCheese">
        <input type="text" v-model="currentCheese.name" placeholder="Name" required />
        <input type="text" v-model="currentCheese.region" placeholder="Region" required />
        <input type="text" v-model="currentCheese.type" placeholder="Type" required />
        <input type="text" v-model="currentCheese.milk_type" placeholder="Milk Type" required />
        <input type="text" v-model="currentCheese.aging_period" placeholder="Aging Period" required />
        <input type="text" v-model="currentCheese.flavor_profile" placeholder="Flavor Profile" required />
        <input type="text" v-model="currentCheese.texture" placeholder="Texture" required />
        <input type="text" v-model="currentCheese.serving_temperature" placeholder="Serving Temperature" required />
        <input type="text" v-model="currentCheese.wine_pairing" placeholder="Wine Pairing" required />
        <input type="text" v-model="currentCheese.bread_pairing" placeholder="Bread Pairing" required />
        <input type="text" v-model="currentCheese.fruit_pairing" placeholder="Fruit Pairing" required />
        <input type="file" @change="onFileChange" />
        <button type="submit">Update Cheese</button>
        <button @click="deleteCheese(currentCheese.id)">Delete Cheese</button>
        <button @click="showEditCheeseModal = false">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cheeses: [],
      showAddCheeseModal: false,
      showEditCheeseModal: false,
      newCheese: {
        name: '',
        region: '',
        type: '',
        milk_type: '',
        aging_period: '',
        flavor_profile: '',
        texture: '',
        serving_temperature: '',
        wine_pairing: '',
        bread_pairing: '',
        fruit_pairing: '',
        image: null
      },
      currentCheese: null,
      selectedFile: null
    };
  },
  methods: {
    fetchCheeses() {
      axios.get('http://localhost:3000/api/cheeses')
        .then(response => {
          this.cheeses = response.data;
        })
        .catch(error => {
          console.error('Error fetching cheeses:', error);
        });
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    addCheese() {
      const formData = new FormData();
      for (const key in this.newCheese) {
        formData.append(key, this.newCheese[key]);
      }
      formData.append('image', this.selectedFile);

      axios.post('http://localhost:3000/api/cheeses', formData)
        .then(() => {
          this.fetchCheeses();
          this.showAddCheeseModal = false;
        })
        .catch(error => {
          console.error('Error adding cheese:', error);
        });
    },
    editCheese(cheese) {
      this.currentCheese = { ...cheese };
      this.showEditCheeseModal = true;
    },
    updateCheese() {
      const formData = new FormData();
      for (const key in this.currentCheese) {
        formData.append(key, this.currentCheese[key]);
      }
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      axios.put(`http://localhost:3000/api/cheeses/${this.currentCheese.id}`, formData)
        .then(() => {
          this.fetchCheeses();
          this.showEditCheeseModal = false;
        })
        .catch(error => {
          console.error('Error updating cheese:', error);
        });
    },
    deleteCheese(cheeseId) {
      axios.delete(`http://localhost:3000/api/cheeses/${cheeseId}`)
        .then(() => {
          this.fetchCheeses();
          this.showEditCheeseModal = false;
        })
        .catch(error => {
          console.error('Error deleting cheese:', error);
        });
    }
  },
  created() {
    this.fetchCheeses();
  }
};
</script>

<style scoped>
.cheeses-list {
  padding: 20px;
}

.cheese-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f3f3f3;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cheese-item:hover {
  background-color: #e6e6e6;
  transform: scale(1.02);
}

.cheese-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.cheese-item span {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  font-family: "Rubik", sans-serif;
}

.modal {
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
</style>
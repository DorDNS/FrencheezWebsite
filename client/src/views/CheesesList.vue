<template>
  <div class="cheeses-list-page">
    <h1>Cheeses List</h1>
    <div class="cheese-grid">
      <div
        v-for="cheese in cheeses"
        :key="cheese.id"
        class="cheese-card"
        @click="editCheese(cheese)"
      >
        <img :src="`http://localhost:3000${cheese.image_path}`" alt="Cheese Image" class="cheese-image" />
        <h4>{{ cheese.name }}</h4>
        <p><strong>Region:</strong> {{ cheese.region }}</p>
        <p><strong>Type:</strong> {{ cheese.type }}</p>
      </div>
      <div class="cheese-card add-cheese-card" @click="showAddCheeseModal = true">
        <span class="plus-icon">+</span>
      </div>
    </div>

    <!-- Modal for Adding a New Cheese -->
    <div v-if="showAddCheeseModal" class="modal">
      <div class="modal-content">
        <h3>Add New Cheese</h3>
        <form @submit.prevent="addCheese">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" v-model="newCheese.name" placeholder="Name" required />
            </div>
            <div class="form-group">
              <label for="region">Region</label>
              <input type="text" id="region" v-model="newCheese.region" placeholder="Region" required />
            </div>
            <div class="form-group">
              <label for="type">Type</label>
              <input type="text" id="type" v-model="newCheese.type" placeholder="Type" required />
            </div>
            <div class="form-group">
              <label for="milk_type">Milk Type</label>
              <input type="text" id="milk_type" v-model="newCheese.milk_type" placeholder="Milk Type" required />
            </div>
            <div class="form-group">
              <label for="aging_period">Aging Period</label>
              <input type="text" id="aging_period" v-model="newCheese.aging_period" placeholder="Aging Period" required />
            </div>
            <div class="form-group">
              <label for="flavor_profile">Flavor Profile</label>
              <input type="text" id="flavor_profile" v-model="newCheese.flavor_profile" placeholder="Flavor Profile" required />
            </div>
            <div class="form-group">
              <label for="texture">Texture</label>
              <input type="text" id="texture" v-model="newCheese.texture" placeholder="Texture" required />
            </div>
            <div class="form-group">
              <label for="serving_temperature">Serving Temperature</label>
              <input type="text" id="serving_temperature" v-model="newCheese.serving_temperature" placeholder="Serving Temperature" required />
            </div>
            <div class="form-group">
              <label for="wine_pairing">Wine Pairing</label>
              <input type="text" id="wine_pairing" v-model="newCheese.wine_pairing" placeholder="Wine Pairing" required />
            </div>
            <div class="form-group">
              <label for="bread_pairing">Bread Pairing</label>
              <input type="text" id="bread_pairing" v-model="newCheese.bread_pairing" placeholder="Bread Pairing" required />
            </div>
            <div class="form-group">
              <label for="fruit_pairing">Fruit Pairing</label>
              <input type="text" id="fruit_pairing" v-model="newCheese.fruit_pairing" placeholder="Fruit Pairing" required />
            </div>
            <div class="form-group">
              <label for="image">Image</label>
              <input type="file" id="image" @change="onFileChange" required />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit">Add Cheese</button>
            <button type="button" @click="showAddCheeseModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal for Editing a Cheese -->
    <div v-if="showEditCheeseModal" class="modal">
      <div class="modal-content">
        <h3>Edit Cheese</h3>
        <form @submit.prevent="updateCheese">
          <div class="form-grid">
            <div class="form-group">
              <label for="edit_name">Name</label>
              <input type="text" id="edit_name" v-model="currentCheese.name" placeholder="Name" required />
            </div>
            <div class="form-group">
              <label for="edit_region">Region</label>
              <input type="text" id="edit_region" v-model="currentCheese.region" placeholder="Region" required />
            </div>
            <div class="form-group">
              <label for="edit_type">Type</label>
              <input type="text" id="edit_type" v-model="currentCheese.type" placeholder="Type" required />
            </div>
            <div class="form-group">
              <label for="edit_milk_type">Milk Type</label>
              <input type="text" id="edit_milk_type" v-model="currentCheese.milk_type" placeholder="Milk Type" required />
            </div>
            <div class="form-group">
              <label for="edit_aging_period">Aging Period</label>
              <input type="text" id="edit_aging_period" v-model="currentCheese.aging_period" placeholder="Aging Period" required />
            </div>
            <div class="form-group">
              <label for="edit_flavor_profile">Flavor Profile</label>
              <input type="text" id="edit_flavor_profile" v-model="currentCheese.flavor_profile" placeholder="Flavor Profile" required />
            </div>
            <div class="form-group">
              <label for="edit_texture">Texture</label>
              <input type="text" id="edit_texture" v-model="currentCheese.texture" placeholder="Texture" required />
            </div>
            <div class="form-group">
              <label for="edit_serving_temperature">Serving Temperature</label>
              <input type="text" id="edit_serving_temperature" v-model="currentCheese.serving_temperature" placeholder="Serving Temperature" required />
            </div>
            <div class="form-group">
              <label for="edit_wine_pairing">Wine Pairing</label>
              <input type="text" id="edit_wine_pairing" v-model="currentCheese.wine_pairing" placeholder="Wine Pairing" required />
            </div>
            <div class="form-group">
              <label for="edit_bread_pairing">Bread Pairing</label>
              <input type="text" id="edit_bread_pairing" v-model="currentCheese.bread_pairing" placeholder="Bread Pairing" required />
            </div>
            <div class="form-group">
              <label for="edit_fruit_pairing">Fruit Pairing</label>
              <input type="text" id="edit_fruit_pairing" v-model="currentCheese.fruit_pairing" placeholder="Fruit Pairing" required />
            </div>
            <div class="form-group">
              <label for="edit_image">Image</label>
              <input type="file" id="edit_image" @change="onFileChange" />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit">Update Cheese</button>
            <button type="button" @click="deleteCheese(currentCheese.id)">Delete Cheese</button>
            <button type="button" @click="showEditCheeseModal = false">Cancel</button>
          </div>
        </form>
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
.cheeses-list-page {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  font-family: 'Rubik', sans-serif;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.cheese-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.cheese-card {
  padding: 15px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cheese-card:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.cheese-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.add-cheese-card {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ccc;
}

.plus-icon {
  font-size: 3rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #ffffff;
  padding: 15px; /* Réduit le padding pour rendre la modale plus compacte */
  border-radius: 8px;
  width: 600px; /* Augmente la largeur de la modale pour deux colonnes */
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.modal-content label {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 2px; /* Réduit l'espacement entre le label et le champ */
}

.modal-content input {
  margin-bottom: 8px; /* Réduit l'espacement après chaque champ */
  padding: 5px; /* Réduit le padding des champs de texte */
  font-size: 0.9rem; /* Réduit la taille de la police des champs de texte */
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.modal-content button {
  padding: 8px; /* Réduit le padding des boutons */
  font-size: 0.9rem; /* Réduit la taille de la police des boutons */
}
</style>
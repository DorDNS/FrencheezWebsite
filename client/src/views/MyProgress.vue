<template>
  <div class="my-progress">
    <button @click="logout" class="logout-button">Log Out</button>
    <!-- Contenu de la page My Progress -->
  </div>
</template>

<script>
export default {
  name: "MyProgress",
  methods: {
      logout() {
          localStorage.removeItem('token'); // Exemple de suppression d'un token stocké dans le localStorage
          this.$router.push('/login'); // Redirection vers la page de login
      }
  }
};
</script>

<style scoped>
.my-progress {
  max-width: 700px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background-color: #FFFFFF; /* Fond similaire à la carte dans CheeseInfoPage */
  font-family: 'Rubik', sans-serif;
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
  font-family: 'Rubik', sans-serif;
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
</style>

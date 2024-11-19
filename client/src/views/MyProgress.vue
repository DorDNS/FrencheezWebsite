<template>
    <div class="my-progress">
      <button @click="logout" class="logout-button">Logout</button>
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
    margin: 0 auto 20px;
    padding: 10px 20px;
    font-size: 1rem;
    color: #fff;
    background-color: #575dce;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .logout-button:hover {
    background-color: #4646a8;
  }
  </style>
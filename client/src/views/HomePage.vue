<template>
  <div class="homepage">
    <!-- Title with full-width line -->
    <div class="title-container">
      <h1>Bonjour!</h1>
    </div>
    
    <!-- Introductory Text and Images Grid -->
    <div class="content-grid">
      <!-- First row: Text on the left, Image1 on the right -->
      <div class="text">
        <p>Discover the rich, creamy, and complex flavors that make French cheeses famous worldwide.</p>
        <p>From the rugged mountains of the Alps to the lush pastures of Normandy, every region of France brings its unique character to cheese-making.</p>
      </div>
      <img src="/images/image1.webp" alt="French cheese assortment" class="image" />

      <!-- Second row: Image2 on the left, Text on the right -->
      <img src="/images/image2.jpeg" alt="Camembert cheese" class="image second-image" />
      <div class="text second-paragraph">
        <p>French cheese-making has been a cherished tradition for centuries, with each variety reflecting the land, culture, and artistry of its region.</p>
        <p>From creamy Camembert to tangy Roquefort, each cheese tells a story of the French countryside, skilled artisans, and age-old techniques.</p>
      </div>

      <!-- Third row: Text on the left, Image3 on the right -->
      <div class="text call-to-action">
        <p><strong>Ready to begin?</strong></p>
        <ul>
          <li>Browse our Cheese Hall of Fame for an immersive exploration of France's cheese varieties.</li>
          <li>Take our Cheese Quiz to start learning in a fun and interactive way.</li>
          <li>Visit your Progress to save favorites and record tasting notes.</li>
        </ul>
      </div>
      <img src="/images/image3.webp" alt="Cheese board" class="image" />
    </div>
  </div>
</template>

   
<script>
  export default {
    name: "HomePage",
  };
</script>
   
<style scoped>
  .homepage {
    max-width: 100%;
    margin: auto;
    padding: 20px;
    font-family: 'Rubik', sans-serif;
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
   
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    padding: 0 100px; /* Ajouter du padding pour créer de l'espace */
  }
   
  .text {
    font-size: 1.3rem;
    color: #333;
    line-height: 1.8;
  }
   
  .call-to-action p {
    font-size: 1.3rem;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
  }
   
  .image {
    width: 100%;
    height: auto;
    max-height: 250px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 920px) {
    .content-grid {
      display: flex;
      flex-direction: column;
      padding: 0 20px;
    }

    .content-grid > * {
      margin-bottom: 20px;
    }

    .second-paragraph {
      order: 1; /* Move second paragraph before the second image */
    }
  
    .second-image {
      order: 2; /* Keep second image after the paragraph */
    }
  }

</style>
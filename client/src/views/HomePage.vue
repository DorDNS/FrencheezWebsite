<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="italic-intro"><em>Say Cheese!</em></h1>
        <h1>Welcome to Frencheez</h1>
        <p>Explore the rich, delicious, and diverse world of French cheeses.</p>
        <router-link to="/hall-of-fame" class="cta-button cheese-style"><span>Explore the Hall of Fame</span></router-link>
      </div>
    </section>

    <!-- Cheese Description Section -->
    <section class="cheese-description">
      <div class="description-content">
        <img src="/images/image3.webp" alt="Cheese Illustration" class="cheese-image">
        <div class="description-text">
          <h2>Discover the World of Cheese</h2>
          <p>
            French cheeses are not just food; they are an experience. With over a thousand varieties, each cheese tells a story of tradition, region, and flavor. From creamy Brie to tangy Roquefort, there's a cheese for everyone. Dive into the world of textures, tastes, and perfect pairings to elevate your culinary journey.
          </p>
        </div>
      </div>
    </section>

    <!-- Feature Highlights -->
    <section class="features">
      <h2>What Frencheez Offers</h2>
      <div class="features-grid">
        <div class="feature card">
          <img src="/images/database-icon.png" alt="Database Icon">
          <div class="card-content">
            <h3>Concise Cheese Infos</h3>
            <p>Learn about flavor profiles, textures, and pairings.</p>
          </div>
        </div>
        <div class="feature card">
          <img src="/images/quiz-icon.png" alt="Quiz Icon">
          <div class="card-content">
            <h3>Interactive Quizzes</h3>
            <p>Test your knowledge and have fun with cheese trivia.</p>
          </div>
        </div>
        <div class="feature card">
          <img src="/images/user-icon.png" alt="User Icon">
          <div class="card-content">
            <h3>User Profile</h3>
            <p>Track your progress and save your favorite cheeses.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
/* Import Rubik Font */
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap');

/* General Styling */
.landing-page {
  font-family: 'Rubik', sans-serif;
  color: #333;
  line-height: 1.6;
}

/* Hero Section */
.hero {
  background-image: url('../../public/images/image1.webp');
  background-size: cover;
  background-position: center;
  text-align: center;
  padding: 70px 20px;
  color: white;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px); /* Blur effect */
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin: 0;
}

.hero-content .italic-intro {
  font-style: italic;
}

.hero-content p {
  font-size: 1.2rem;
  margin-top: 20px;
}

.cta-button {
  display: inline-block;
  color: #333;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.cta-button:hover {
  transform: scale(1.05);
}

.cheese-style {
  background: url('../../public/images/cheese-background.jpg') center/cover;
  background-color: #ffcc00; /* Fallback color */
  color: #333;
  padding: 15px 30px; /* Maintain button size */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.5rem; /* Keep base font size for consistency */
  border: 2px solid #e6b800;
  line-height: 1.5; /* Increase text height without affecting button size */
}


.cheese-style:hover {
  background-color: #ffd633; /* Slightly lighter shade on hover */
  border-color: #ffc300;
}

/* Cheese Description Section */
.cheese-description {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px 20px;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.cheese-description .description-content {
  display: flex;
  align-items: center;
  gap: 40px;
  width: 100%;
}

.cheese-description .cheese-image {
  flex: 1;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cheese-description .description-text {
  flex: 1;
  text-align: center;
}

.cheese-description .description-text h2 {
  font-size: 2rem; /* Matches the size of "What Frencheez Offers" */
  margin: 15px;
}

.cheese-description .description-text p {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

/* Responsive Design for Cheese Description */
@media (max-width: 768px) {
  .cheese-description .description-content {
    flex-direction: column; /* Stack text and image vertically */
    align-items: center;
  }

  .cheese-description .cheese-image {
    order: 2; /* Ensure the image appears after the text */
    width: 100%; /* Make image responsive */
    max-width: 300px; /* Optional max width for smaller screens */
  }

  .cheese-description .description-text {
    order: 1; /* Text comes first */
    text-align: center;
    margin-bottom: 20px; /* Add spacing between text and image */
  }
}


/* Features Section */
.features {
  text-align: center;
  padding: 0px 20px 50px 20px;
}

.features h2 {
  font-size: 2rem;
  margin-bottom: 30px;
}

.features-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.feature.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature.card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.feature img {
  width: 60px;
  margin-bottom: 15px;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.card-content h3 {
  font-size: 1.2rem;
  margin: 0;
}

.card-content p {
  font-size: 0.9rem;
  margin: 0;
}
</style>